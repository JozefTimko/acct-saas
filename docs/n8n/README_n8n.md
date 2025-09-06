# n8n Workflow: Workpapers v1 (Spec Extract)

**Purpose:** Import Trial Balance and Journals from Xero for a selected tenant and period, split by selected nominals, then build an Excel workbook and return it for download.

## Happy Path
1) Get Xero connections → select tenant
2) Build WHERE clause + paginate Journals
3) Collect pages → consolidate → filter lines by selected nominals and date range
4) Split lines into one sheet per nominal
5) Format rows for Excel (meta header, Dr/Cr, totals)
6) Build Excel workbook; add TB sheet; emit binary; return to client

## Key Parameters (from webhook/body)
- `tenantId`: Xero tenant to use
- `startDate` / `endDate`: inclusive ISO dates
- `nominals`: array of account codes to include
- `debug` (optional)

## Rate-limits & Pagination
- Paginates Journals using `offset` and `X-Records-Remaining` (if present)
- Consolidates all pages in memory before Excel build

## Known Issues / Notes
- Xero tenant ID was hard-coded in one header in n8n; now **redacted** in the sanitized JSON.
- Excel node specifics are replaced in code with **ExcelJS** (deterministic formatting).
- Replace Wait/If/Merge with clear pipeline steps in workers.

## Migration Targets
- API routes under `/app/api/...`
- Xero client & parsers under `/lib/xero/...`
- Workpaper transforms under `/lib/workpapers/...`
- Excel builder under `/lib/excel/...`
- Background jobs under `/queues` + `/workers`
