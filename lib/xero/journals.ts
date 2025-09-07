import { XeroClient } from 'xero-node';
import { withRetry, isRetryableError } from './retry';
import { 
  XeroJournalsResponseSchema, 
  GLRow, 
  FetchJournalsParams,
  DEFAULT_RETRY_CONFIG 
} from './types';

// ✅ Add for DI:
import type { XeroClient } from 'xero-node';

// Use this tiny type to allow tests to pass a fake client
type JournalsDeps = { client?: XeroClient };

export class XeroJournalsError extends Error {
  constructor(
    message: string,
    public readonly tenantId: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'XeroJournalsError';
  }
}

// AFTER
export async function fetchJournals(
    params: { tenantId: string; startDate: string; endDate: string; nominals: string[] },
    deps: JournalsDeps = {}
  ) {
    const { tenantId, startDate, endDate, nominals } = params;
  
    // Only enforce env when we are constructing a real client
    if (!deps.client) {
      if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
        throw new XeroJournalsError('Xero credentials not configured', tenantId, startDate, endDate);
      }
    }
  
    const client =
      deps.client ??
      new XeroClient({
        clientId: process.env.XERO_CLIENT_ID!,
        clientSecret: process.env.XERO_CLIENT_SECRET!,
        redirectUris: [process.env.XERO_REDIRECT_URI!],
        scopes: ['accounting.transactions.read'],
      });
  
    // ⬇️ keep your existing logic below ⬇️
    const where = `JournalDate>=DateTime(${startDate}) AND JournalDate<=DateTime(${endDate})`;
    const order = 'JournalDate ASC';
  
    const pageSize = 200;     // keep your current page size
    let offset = 0;
    const all: any[] = [];    // or your typed array, if you already have it
  
    while (true) {
      const resp = await client.accountingApi.getJournals(
        tenantId,
        undefined,    // ifModifiedSince
        where,
        order,
        offset,
        pageSize
      );
  
      const page = resp.body;                         // keep as in your code
      const validated = validateJournalData(page);    // your existing function
      all.push(...validated.journals);
  
      const hasMore = validated?.pagination
        ? validated.pagination.page < validated.pagination.pageCount
        : validated.journals.length === pageSize;
  
      if (!hasMore) break;
      offset += pageSize;
    }
  
    const filtered = nominals?.length
      ? filterJournalsByNominals(all, nominals)       // your existing helper
      : all;
  
    const transformed = transformJournalData(filtered, startDate, endDate, nominals); // your existing function
    return sortJournalsByDate(transformed);            // your existing helper
  }
  

  try {
    const allJournalLines: GLRow[] = [];
    let currentOffset = offset;
    let hasMorePages = true;
    let totalPages = 0;

    while (hasMorePages) {
      const journalsData = await withRetry(
        async () => {
          const response = await xeroClient.accountingApi.getJournals(
            tenantId,
            undefined, // ifModifiedSince
            undefined, // where
            undefined, // order
            currentOffset,
            pageSize
          );
          
          if (!response.body) {
            throw new Error('No journal data returned from Xero');
          }
          
          return response.body;
        },
        DEFAULT_RETRY_CONFIG
      );

      // Validate the response with Zod
      const validatedData = XeroJournalsResponseSchema.parse(journalsData);
      
      // Transform and filter journal data
      const journalLines = transformJournalData(validatedData, startDate, endDate, nominals);
      allJournalLines.push(...journalLines);
      
      // Check if there are more pages
      if (validatedData.pagination) {
        totalPages = validatedData.pagination.pageCount;
        const currentPage = validatedData.pagination.page;
        hasMorePages = currentPage < totalPages;
        currentOffset = currentPage * pageSize;
      } else {
        hasMorePages = false;
      }
      
      // Safety check to prevent infinite loops
      if (currentOffset > 10000) {
        console.warn('Reached maximum offset limit, stopping pagination');
        break;
      }
    }

    console.log(`Fetched ${allJournalLines.length} journal lines across ${totalPages} pages`);
    return allJournalLines;
    
  } catch (error) {
    if (error instanceof XeroJournalsError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new XeroJournalsError(
      `Failed to fetch journals: ${errorMessage}`,
      tenantId,
      startDate,
      endDate,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Transforms Xero journal data to internal GLRow format
 */
function transformJournalData(
  xeroData: any, 
  startDate: string, 
  endDate: string, 
  nominals: string[]
): GLRow[] {
  const glRows: GLRow[] = [];
  
  if (!xeroData.journals) {
    return glRows;
  }

  for (const journal of xeroData.journals) {
    // Filter by date range
    const journalDate = journal.journalDate;
    if (journalDate < startDate || journalDate > endDate) {
      continue;
    }

    if (!journal.journalLines) {
      continue;
    }

    for (const line of journal.journalLines) {
      // Filter by nominals if specified
      if (nominals.length > 0 && !nominals.includes(line.accountCode)) {
        continue;
      }

      // Skip zero-amount lines
      if (line.netAmount === 0) {
        continue;
      }

      glRows.push({
        id: line.journalLineID,
        date: journal.journalDate,
        journalNumber: journal.journalNumber,
        accountCode: line.accountCode,
        accountName: line.accountName,
        description: line.description,
        net: line.netAmount,
        tax: line.taxAmount,
        gross: line.grossAmount,
        source: journal.sourceType,
        reference: journal.reference,
      });
    }
  }
  
  return glRows;
}

/**
 * Fetches journals with pagination and returns all results
 */
export async function fetchAllJournals(
  params: FetchJournalsParams
): Promise<GLRow[]> {
  return fetchJournals(params);
}

/**
 * Fetches journals for a specific page
 */
export async function fetchJournalsPage(
  params: FetchJournalsParams & { page: number }
): Promise<{ data: GLRow[]; hasMore: boolean; totalPages: number }> {
  const { page, pageSize = 100 } = params;
  const offset = page * pageSize;
  
  const data = await fetchJournals({ ...params, offset, pageSize });
  
  // Determine if there are more pages by checking if we got a full page
  const hasMore = data.length === pageSize;
  
  return {
    data,
    hasMore,
    totalPages: hasMore ? page + 2 : page + 1, // Estimate, actual count would need separate API call
  };
}

/**
 * Validates that the journal data is complete and consistent
 */
export function validateJournalData(glRows: GLRow[]): void {
  if (glRows.length === 0) {
    throw new Error('No journal data found');
  }
  
  // Check for required fields
  for (const row of glRows) {
    if (!row.id) {
      throw new Error('Journal line ID is required for all journal rows');
    }
    if (!row.date) {
      throw new Error('Date is required for all journal rows');
    }
    if (!row.accountCode) {
      throw new Error('Account code is required for all journal rows');
    }
    if (!row.accountName) {
      throw new Error('Account name is required for all journal rows');
    }
    if (typeof row.net !== 'number') {
      throw new Error('Net amount is required for all journal rows');
    }
  }
  
  // Check for duplicate journal line IDs
  const lineIds = glRows.map(row => row.id);
  const uniqueIds = new Set(lineIds);
  if (lineIds.length !== uniqueIds.size) {
    throw new Error('Duplicate journal line IDs found in journal data');
  }
}

/**
 * Filters journal data by account codes
 */
export function filterJournalsByNominals(glRows: GLRow[], nominals: string[]): GLRow[] {
  if (nominals.length === 0) {
    return glRows;
  }
  
  return glRows.filter(row => nominals.includes(row.accountCode));
}

/**
 * Sorts journal data by date (ascending)
 */
export function sortJournalsByDate(glRows: GLRow[]): GLRow[] {
  return glRows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

