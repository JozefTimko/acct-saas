# Workpapers v1 — Product & Technical Spec

## 1) Scope

### In scope (v1)
- Connect to **Xero** (tenant selection via OAuth already handled elsewhere).
- For a chosen **company + period**:  
  1) Fetch **Trial Balance** (TB) at the period end.  
  2) Fetch **Journals** for the same date range (optionally filtered by selected **nominal/account codes**).  
  3) Normalize and consolidate TB/GL to an internal schema.  
  4) Generate a deterministic **Excel workbook**:  
     - Tab 1: **Trial Balance**  
     - Tabs 2..N: **Nominal detail** (one per selected nominal)  
  5) (Optional v1a) Generate **AI narrative** for Revenue (and later PPE/Accruals) referencing TB and nominal tabs.  
  6) Upload workbook to storage and return a signed URL.

### Out of scope (v1)
- Multi-entity consolidations.
- Full FS generation; disclosures; tax notes.
- User roles/permissions beyond basic RLS (added as NFR).
- Non-Xero bookkeeping systems.

---

## 2) Module Map (files & responsibilities)

/app/
/api/
/imports/start/route.ts # Enqueue an import job (TB+GL+Excel)
/workpapers/build/route.ts # Generate an AI narrative for a section (e.g., Revenue)

/lib/
/xero/
trialBalance.ts # fetchTrialBalance(endDate, tenantId)
journals.ts # fetchJournals({tenantId, startDate, endDate, nominals, offset})
normalize.ts # TB/GL -> internal schema (types)
connections.ts # listConnections()
tenant.ts # resolveTenant(tenantHint?) if needed
mapCompanies.ts # helper mapping (if re-used)
/workpapers/
filterLines.ts # filter by nominal/date; dedupe, sort
splitByNominal.ts # GL -> { [accountCode]: rows[] }
sortByDate.ts # date ascending
dedupeLines.ts # remove duplicates by id/hash
/excel/
formatForExcel.ts # prepare arrays-of-arrays from objects
buildWorkpapers.ts # ExcelJS builder (TB + nominal tabs)
workbookState.ts # attach/carry workbook state (in-memory buffer)
/http/
shapeRequest.ts # massage inbound bodies (if needed)
/ai/
narrative.ts # prompt + self-check + escalation logic

/queues/
imports.ts # BullMQ queue definitions & job producers

/workers/
imports.ts # BullMQ processors: TB -> GL -> normalize -> excel -> store

/tests/
/api/workpapers.build.test.ts # API tests for narrative endpoint
/workbooks/excel.test.ts # workbook shape & totals
/xero/journals.test.ts # pagination & retries
/xero/trialBalance.test.ts # TB fetching & mapping

csharp
Copy code

---

## 3) Data & Types

### 3.1 Zod Schemas (server-side)

`	s
import { z } from "zod";

export const DateISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ImportStartBody = z.object({
  companyId: z.string().min(1),
  periodStart: DateISO,
  periodEnd: DateISO,
  selectedNominals: z.array(z.string().min(1)).default([]),
  debug: z.boolean().optional(),
});

export type ImportStartBody = z.infer<typeof ImportStartBody>;

export const NarrativeBody = z.object({
  engagementId: z.string().min(1),
  section: z.enum(["Revenue", "PPE", "Accruals"]), // extend later
});

export type NarrativeBody = z.infer<typeof NarrativeBody>;
3.2 Internal Types
ts
Copy code
export type TBRow = {
  accountCode: string; accountName: string;
  opening?: number; movement?: number; closing: number;
  isDebit?: boolean;
};

export type GLRow = {
  id: string; date: string; journalNumber?: string;
  accountCode: string; accountName: string;
  description?: string; net: number; tax?: number; gross?: number;
  source?: string; reference?: string;
};

export type WorkpaperWorkbookMeta = {
  engagementId: string;
  periodStart: string; periodEnd: string;
  nominalTabs: string[];
  tbSheetName: string;
};

export type NarrativeDraft = {
  section: "Revenue" | "PPE" | "Accruals";
  contentMarkdown: string;
  modelUsed: string;
  confidence: "low" | "medium" | "high";
  citations: Array<{ sheet: string; cell: string; note?: string }>;
};
4) API Contracts
4.1 POST /api/imports/start
Purpose: Enqueue import job (TB + GL + Excel build).

Request body: ImportStartBody.

Response: { jobId: string }

Status codes: 202, 400, 401/403, 500.

4.2 POST /api/workpapers/build
Purpose: Generate AI narrative for a section.

Request body: NarrativeBody.

Response: { draftId, section, modelUsed, confidence, citations }

Status codes: 200, 400, 401/403, 404, 429, 500.

5) Job Schemas (BullMQ)
Queue: imports
ts
Copy code
type ImportJob = {
  companyId: string;
  engagementId: string;
  periodStart: string;
  periodEnd: string;
  selectedNominals: string[];
  requestedBy: string;
  debug?: boolean;
};
Processors:

fetchTrialBalance

fetchJournals

consolidateAndNormalize

buildExcel

storeAndFinalize

Options: attempts=5, backoff=exponential, timeout=120s.

6) External Integrations & Edge Cases
Xero Trial Balance: zero-movement accounts, rounding differences, ISO dates.

Xero Journals: pagination via offset, handle 429s with backoff.

Excel: deterministic formatting.

OpenAI: minimal TB/GL slices, citations, self-check, escalate model on failure.

7) Non-Functional Requirements
Security: redact tokens, no training on customer data, sanitize inputs.

Observability: pino logs, Sentry.

Reliability: retries, idempotent processors.

Performance: concurrency caps, streaming pages.

Data: Postgres RLS, retention 180 days.

8) Acceptance Tests (Gherkin)
Import & Excel
gherkin
Copy code
Scenario: Build workbook with TB and selected nominals
  Given a connected Xero tenant
  And period "2024-01-01" to "2024-12-31"
  And selected nominals ["200","260"]
  When I POST to /api/imports/start
  Then a workbook is built with TB and those sheets
Pagination & Retries
gherkin
Copy code
Scenario: Journals require multiple pages
  Given 3 pages exist
  When worker fetches journals
  Then 600 rows consolidated
Narrative
gherkin
Copy code
Scenario: Generate narrative
  Given engagement with TB+Revenue
  When I POST to /api/workpapers/build with section Revenue
  Then narrative cites TB & nominal cells
  And retries with 4.1 if self-check fails
9) Implementation Notes
Replace n8n “Split in Batches” with BullMQ loop.

Replace Merge/If with explicit code.

Replace Excel nodes with ExcelJS.

Never commit secrets.

Store workbook in Supabase/Storage.

10) Example AI Prompts
System: "You are an accounting assistant… FRS 102… cite sheet/cells."
User: "Engagement {{id}} Revenue section… TB slice… Nominal slice…"

Self-check: JSON { hasCitations, numbersMatch, riskNotes }.

11) Open Questions
Add PPE/Accruals later.

Add Management Commentary PDF.

Add firm/org seats & billing.

Add QuickBooks support.

12) Definition of Done
Imports run end-to-end.

Workbook has TB + =1 nominal tab.

Revenue narrative generated with citations.

Acceptance tests pass.

No secrets in repo; logs redacted.
