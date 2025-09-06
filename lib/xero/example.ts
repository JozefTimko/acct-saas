/**
 * Example usage of the Xero trial balance and journals modules
 * This file demonstrates how to use the implemented functions
 */

import { fetchTrialBalance, validateTrialBalanceData } from './trialBalance';
import { 
  fetchJournals, 
  validateJournalData, 
  filterJournalsByNominals, 
  sortJournalsByDate 
} from './journals';

/**
 * Example: Fetch trial balance for a company
 */
export async function exampleFetchTrialBalance() {
  try {
    const trialBalance = await fetchTrialBalance({
      tenantId: 'your-xero-tenant-id',
      endDate: '2024-01-31',
    });

    // Validate the data
    validateTrialBalanceData(trialBalance);

    console.log(`Fetched ${trialBalance.length} trial balance rows`);
    
    // Log some sample data
    trialBalance.slice(0, 5).forEach(row => {
      console.log(`${row.accountCode} - ${row.accountName}: ${row.closing}`);
    });

    return trialBalance;
  } catch (error) {
    console.error('Failed to fetch trial balance:', error);
    throw error;
  }
}

/**
 * Example: Fetch journals for a company with filtering
 */
export async function exampleFetchJournals() {
  try {
    const journals = await fetchJournals({
      tenantId: 'your-xero-tenant-id',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      nominals: ['1000', '2000', '3000'], // Filter by specific account codes
      pageSize: 100,
    });

    // Validate the data
    validateJournalData(journals);

    console.log(`Fetched ${journals.length} journal lines`);

    // Sort by date
    const sortedJournals = sortJournalsByDate(journals);

    // Log some sample data
    sortedJournals.slice(0, 5).forEach(row => {
      console.log(`${row.date} - ${row.accountCode} (${row.accountName}): ${row.net}`);
    });

    return sortedJournals;
  } catch (error) {
    console.error('Failed to fetch journals:', error);
    throw error;
  }
}

/**
 * Example: Complete workflow - fetch both TB and journals
 */
export async function exampleCompleteWorkflow() {
  const tenantId = 'your-xero-tenant-id';
  const endDate = '2024-01-31';
  const startDate = '2024-01-01';

  try {
    console.log('Starting complete workflow...');

    // Fetch trial balance
    console.log('Fetching trial balance...');
    const trialBalance = await fetchTrialBalance({
      tenantId,
      endDate,
    });

    // Fetch journals
    console.log('Fetching journals...');
    const journals = await fetchJournals({
      tenantId,
      startDate,
      endDate,
    });

    // Process the data
    console.log('Processing data...');
    
    // Get unique account codes from trial balance
    const tbAccountCodes = new Set(trialBalance.map(row => row.accountCode));
    
    // Filter journals to only include accounts that appear in trial balance
    const relevantJournals = journals.filter(journal => 
      tbAccountCodes.has(journal.accountCode)
    );

    // Group journals by account code
    const journalsByAccount = relevantJournals.reduce((acc, journal) => {
      if (!acc[journal.accountCode]) {
        acc[journal.accountCode] = [];
      }
      acc[journal.accountCode].push(journal);
      return acc;
    }, {} as Record<string, typeof journals>);

    console.log('Workflow completed successfully!');
    console.log(`Trial Balance: ${trialBalance.length} accounts`);
    console.log(`Journals: ${journals.length} lines`);
    console.log(`Relevant Journals: ${relevantJournals.length} lines`);

    return {
      trialBalance,
      journals: relevantJournals,
      journalsByAccount,
    };
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
}

/**
 * Example: Error handling with retries
 */
export async function exampleWithErrorHandling() {
  try {
    const result = await exampleCompleteWorkflow();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    
    // In a real application, you might want to:
    // - Log to a monitoring service (e.g., Sentry)
    // - Send alerts to administrators
    // - Store error details in a database
    // - Implement fallback strategies
    
    throw error;
  }
}
