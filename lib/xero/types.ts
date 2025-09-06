import { z } from "zod";

// Zod schemas for Xero API responses
export const XeroTrialBalanceSchema = z.object({
  reportID: z.string(),
  reportName: z.string(),
  reportDate: z.string(),
  reportDateString: z.string(),
  updatedDateUTC: z.string(),
  rows: z.array(z.object({
    rowType: z.string(),
    cells: z.array(z.object({
      value: z.string().optional(),
      attributes: z.array(z.object({
        value: z.string(),
      })).optional(),
    })),
    rows: z.array(z.object({
      rowType: z.string(),
      cells: z.array(z.object({
        value: z.string().optional(),
        attributes: z.array(z.object({
          value: z.string(),
        })).optional(),
      })),
    })).optional(),
  })),
});

export const XeroJournalSchema = z.object({
  journalID: z.string(),
  journalDate: z.string(),
  journalNumber: z.string().optional(),
  reference: z.string().optional(),
  sourceID: z.string().optional(),
  sourceType: z.string().optional(),
  createdDateUTC: z.string(),
  updatedDateUTC: z.string(),
  journalLines: z.array(z.object({
    journalLineID: z.string(),
    accountID: z.string(),
    accountCode: z.string(),
    accountType: z.string(),
    accountName: z.string(),
    description: z.string().optional(),
    netAmount: z.number(),
    grossAmount: z.number().optional(),
    taxAmount: z.number().optional(),
    taxType: z.string().optional(),
    taxName: z.string().optional(),
    tracking: z.array(z.object({
      trackingCategoryID: z.string(),
      trackingOptionID: z.string(),
      name: z.string(),
      option: z.string(),
    })).optional(),
  })),
});

export const XeroJournalsResponseSchema = z.object({
  journals: z.array(XeroJournalSchema),
  pagination: z.object({
    page: z.number(),
    pageCount: z.number(),
    itemCount: z.number(),
  }).optional(),
});

// Internal types for normalized data
export type TBRow = {
  accountCode: string;
  accountName: string;
  opening?: number;
  movement?: number;
  closing: number;
  isDebit?: boolean;
};

export type GLRow = {
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

export type XeroTrialBalance = z.infer<typeof XeroTrialBalanceSchema>;
export type XeroJournal = z.infer<typeof XeroJournalSchema>;
export type XeroJournalsResponse = z.infer<typeof XeroJournalsResponseSchema>;

// API request types
export type FetchTrialBalanceParams = {
  tenantId: string;
  endDate: string; // ISO date string
};

export type FetchJournalsParams = {
  tenantId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  nominals?: string[]; // Account codes to filter by
  offset?: number;
  pageSize?: number;
};

// Retry configuration
export type RetryConfig = {
  maxAttempts: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
};

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
};
