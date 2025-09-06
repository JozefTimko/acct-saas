import { XeroClient } from 'xero-node';
import { withRetry, isRetryableError } from './retry';
import { 
  XeroTrialBalanceSchema, 
  TBRow, 
  FetchTrialBalanceParams,
  DEFAULT_RETRY_CONFIG 
} from './types';

export class XeroTrialBalanceError extends Error {
  constructor(
    message: string,
    public readonly tenantId: string,
    public readonly endDate: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'XeroTrialBalanceError';
  }
}

/**
 * Fetches trial balance data from Xero for a specific tenant and end date
 */
export async function fetchTrialBalance(
  params: FetchTrialBalanceParams
): Promise<TBRow[]> {
  const { tenantId, endDate } = params;
  
  if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
    throw new XeroTrialBalanceError(
      'Xero credentials not configured',
      tenantId,
      endDate
    );
  }

  const xeroClient = new XeroClient({
    clientId: process.env.XERO_CLIENT_ID,
    clientSecret: process.env.XERO_CLIENT_SECRET,
    redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/auth/callback'],
    scopes: 'accounting.reports.read',
  });

  try {
    const trialBalanceData = await withRetry(
      async () => {
        const response = await xeroClient.accountingApi.getReportTrialBalance(
          tenantId,
          endDate
        );
        
        if (!response.body) {
          throw new Error('No trial balance data returned from Xero');
        }
        
        return response.body;
      },
      DEFAULT_RETRY_CONFIG
    );

    // Validate the response with Zod
    const validatedData = XeroTrialBalanceSchema.parse(trialBalanceData);
    
    // Transform Xero data to internal TBRow format
    return transformTrialBalanceData(validatedData);
    
  } catch (error) {
    if (error instanceof XeroTrialBalanceError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new XeroTrialBalanceError(
      `Failed to fetch trial balance: ${errorMessage}`,
      tenantId,
      endDate,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Transforms Xero trial balance data to internal TBRow format
 */
function transformTrialBalanceData(xeroData: any): TBRow[] {
  const tbRows: TBRow[] = [];
  
  if (!xeroData.rows) {
    return tbRows;
  }

  for (const row of xeroData.rows) {
    // Skip header rows
    if (row.rowType === 'Header') {
      continue;
    }
    
    // Process account rows
    if (row.rowType === 'Section' && row.rows) {
      for (const accountRow of row.rows) {
        if (accountRow.rowType === 'Row' && accountRow.cells && accountRow.cells.length >= 4) {
          const cells = accountRow.cells;
          
          // Extract account information
          const accountCode = cells[0]?.value || '';
          const accountName = cells[1]?.value || '';
          const openingStr = cells[2]?.value || '0';
          const movementStr = cells[3]?.value || '0';
          const closingStr = cells[4]?.value || '0';
          
          // Skip empty rows
          if (!accountCode && !accountName) {
            continue;
          }
          
          // Parse numeric values
          const opening = parseNumericValue(openingStr);
          const movement = parseNumericValue(movementStr);
          const closing = parseNumericValue(closingStr);
          
          // Determine if this is a debit account based on closing balance
          const isDebit = closing > 0;
          
          tbRows.push({
            accountCode: accountCode.trim(),
            accountName: accountName.trim(),
            opening: opening !== 0 ? opening : undefined,
            movement: movement !== 0 ? movement : undefined,
            closing,
            isDebit,
          });
        }
      }
    }
  }
  
  return tbRows;
}

/**
 * Parses a string value to a number, handling Xero's formatting
 */
function parseNumericValue(value: string): number {
  if (!value || value.trim() === '') {
    return 0;
  }
  
  // Remove any non-numeric characters except decimal point and minus sign
  const cleaned = value.replace(/[^\d.-]/g, '');
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validates that the trial balance data is complete and consistent
 */
export function validateTrialBalanceData(tbRows: TBRow[]): void {
  if (tbRows.length === 0) {
    throw new Error('No trial balance data found');
  }
  
  // Check for required fields
  for (const row of tbRows) {
    if (!row.accountCode) {
      throw new Error('Account code is required for all trial balance rows');
    }
    if (!row.accountName) {
      throw new Error('Account name is required for all trial balance rows');
    }
    if (typeof row.closing !== 'number') {
      throw new Error('Closing balance is required for all trial balance rows');
    }
  }
  
  // Check for duplicate account codes
  const accountCodes = tbRows.map(row => row.accountCode);
  const uniqueCodes = new Set(accountCodes);
  if (accountCodes.length !== uniqueCodes.size) {
    throw new Error('Duplicate account codes found in trial balance data');
  }
}
