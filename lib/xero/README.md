# Xero Integration Modules

This directory contains modules for integrating with the Xero accounting API, specifically for fetching trial balance and journal data as part of the workpapers generation system.

## Modules

### Core Modules

- **`types.ts`** - TypeScript types and Zod schemas for Xero API responses
- **`retry.ts`** - Retry logic with exponential backoff for API calls
- **`trialBalance.ts`** - Fetch and transform trial balance data from Xero
- **`journals.ts`** - Fetch and transform journal entries from Xero with pagination

### Utility Modules

- **`example.ts`** - Example usage and workflow demonstrations

## Features

### Trial Balance (`trialBalance.ts`)

- Fetches trial balance data for a specific tenant and end date
- Transforms Xero data format to internal `TBRow` format
- Includes data validation and error handling
- Supports retry logic for failed API calls

**Key Functions:**
- `fetchTrialBalance(params)` - Main function to fetch trial balance
- `validateTrialBalanceData(data)` - Validates the fetched data
- `transformTrialBalanceData(xeroData)` - Converts Xero format to internal format

### Journals (`journals.ts`)

- Fetches journal entries with pagination support
- Filters by date range and account codes (nominals)
- Transforms Xero data format to internal `GLRow` format
- Includes comprehensive error handling and retry logic

**Key Functions:**
- `fetchJournals(params)` - Main function to fetch all journals
- `fetchJournalsPage(params)` - Fetch a specific page of journals
- `validateJournalData(data)` - Validates the fetched data
- `filterJournalsByNominals(data, nominals)` - Filter by account codes
- `sortJournalsByDate(data)` - Sort journals by date

### Retry Logic (`retry.ts`)

- Exponential backoff with jitter to prevent thundering herd
- Configurable retry attempts and delays
- Handles common retryable errors (rate limits, timeouts, server errors)
- Custom `RetryError` class for better error handling

## Usage

### Basic Trial Balance Fetch

```typescript
import { fetchTrialBalance } from './trialBalance';

const trialBalance = await fetchTrialBalance({
  tenantId: 'your-xero-tenant-id',
  endDate: '2024-01-31',
});
```

### Basic Journals Fetch

```typescript
import { fetchJournals } from './journals';

const journals = await fetchJournals({
  tenantId: 'your-xero-tenant-id',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  nominals: ['1000', '2000'], // Optional: filter by account codes
});
```

### Complete Workflow

```typescript
import { exampleCompleteWorkflow } from './example';

const result = await exampleCompleteWorkflow();
// Returns: { trialBalance, journals, journalsByAccount }
```

## Configuration

### Environment Variables

The modules require the following environment variables:

```env
XERO_CLIENT_ID=your-xero-client-id
XERO_CLIENT_SECRET=your-xero-client-secret
XERO_REDIRECT_URI=http://localhost:3000/auth/callback
```

### Retry Configuration

Default retry settings can be customized by modifying `DEFAULT_RETRY_CONFIG` in `types.ts`:

```typescript
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,        // Maximum retry attempts
  baseDelay: 1000,       // Base delay in milliseconds
  maxDelay: 30000,       // Maximum delay in milliseconds
  backoffMultiplier: 2,  // Exponential backoff multiplier
};
```

## Data Types

### TBRow (Trial Balance Row)

```typescript
type TBRow = {
  accountCode: string;
  accountName: string;
  opening?: number;
  movement?: number;
  closing: number;
  isDebit?: boolean;
};
```

### GLRow (General Ledger Row)

```typescript
type GLRow = {
  id: string;
  date: string;
  journalNumber?: string;
  accountCode: string;
  accountName: string;
  description?: string;
  net: number;
  tax?: number;
  gross?: number;
  source?: string;
  reference?: string;
};
```

## Error Handling

All modules include comprehensive error handling:

- **XeroTrialBalanceError** - Specific errors for trial balance operations
- **XeroJournalsError** - Specific errors for journal operations
- **RetryError** - Errors from retry logic with attempt details

## Testing

Test files are located in `tests/xero/`:

- `trialBalance.test.ts` - Tests for trial balance functionality
- `journals.test.ts` - Tests for journals functionality

Run tests with:

```bash
npm test
```

## Dependencies

- `xero-node` - Official Xero Node.js SDK
- `zod` - Runtime type validation
- `vitest` - Testing framework (dev dependency)

## Implementation Notes

1. **Pagination**: The journals module automatically handles pagination to fetch all available data
2. **Rate Limiting**: Built-in retry logic handles Xero's rate limits gracefully
3. **Data Validation**: All API responses are validated using Zod schemas
4. **Type Safety**: Full TypeScript support with comprehensive type definitions
5. **Error Recovery**: Robust error handling with detailed error messages and context

## Future Enhancements

- Support for additional Xero report types
- Caching layer for frequently accessed data
- Batch processing for large datasets
- Integration with monitoring and alerting systems

