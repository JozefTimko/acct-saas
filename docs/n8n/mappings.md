# Node-to-Code Mapping
| n8n Node | Type | New Code Module / Route |
|---|---|---|
| Get Journals | `n8n-nodes-base.httpRequest` | /lib/xero/journals.ts -> fetchJournals(where, offset) |
| Webhook | `n8n-nodes-base.webhook` | /app/api/extract-nominals/route.ts (POST) |
| Merge | `n8n-nodes-base.merge` | (internal) -> handled by worker pipeline merge |
| Edit Fields | `n8n-nodes-base.set` | /lib/http/shapeRequest.ts |
| Filter | `n8n-nodes-base.code` | /lib/workpapers/filterLines.ts |
| Webhook (GET) | `n8n-nodes-base.webhook` | /app/api/xero/companies/route.ts (GET) |
| Get connections (Xero) | `n8n-nodes-base.httpRequest` | /lib/xero/connections.ts -> listConnections() |
| Return companies | `n8n-nodes-base.respondToWebhook` |  |
| Select Tenant for Journals | `n8n-nodes-base.code` | /lib/xero/tenant.ts -> resolveTenant() |
| Map companies | `n8n-nodes-base.code` | /lib/xero/mapCompanies.ts |
| Respond to Webhook | `n8n-nodes-base.respondToWebhook` | /app/api/exports/download (response writer) |
| Sticky Note | `n8n-nodes-base.stickyNote` |  |
| Webhook1 | `n8n-nodes-base.webhook` |  |
| Select tenant | `n8n-nodes-base.set` |  |
| HTTP Request | `n8n-nodes-base.httpRequest` |  |
| Code | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Respond to Webhook1 | `n8n-nodes-base.respondToWebhook` | /app/api/exports/download (response writer) |
| Sticky Note1 | `n8n-nodes-base.stickyNote` |  |
| If | `n8n-nodes-base.if` | (internal) -> branching; replace with code conditions |
| Merge1 | `n8n-nodes-base.merge` | (internal) -> handled by worker pipeline merge |
| Split by nominal | `n8n-nodes-base.code` | /lib/workpapers/splitByNominal.ts |
| Format for Excel Objects | `n8n-nodes-base.code` | /lib/excel/formatForExcel.ts |
| Excel | `@bitovi/n8n-nodes-excel.excel` | /lib/excel/buildWorkbooks.ts (ExcelJS) |
| Save workbook | `n8n-nodes-base.code` | /lib/excel/workbookState.ts |
| Emit final workbook | `n8n-nodes-base.code` | /lib/excel/workbookState.ts |
| No data | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Loop Over Items | `n8n-nodes-base.splitInBatches` | BullMQ pagination loop in /workers/imports.ts |
| Reset workbook | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Code1 | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Objects → AOA (for Excel) | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Attach workbook | `n8n-nodes-base.code` | /lib/excel/workbookState.ts |
| Excel1 | `@bitovi/n8n-nodes-excel.excel` | /lib/excel/buildWorkbooks.ts (ExcelJS) |
| Code2 | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Save workbook2 | `n8n-nodes-base.code` | /lib/excel/workbookState.ts |
| Collect page | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Init paging | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| If1 | `n8n-nodes-base.if` | (internal) -> branching; replace with code conditions |
| Build consolidated body | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Sort date | `n8n-nodes-base.code` | /lib/workpapers/sortByDate.ts |
| Dedupe code | `n8n-nodes-base.code` | /lib/workpapers/dedupeLines.ts |
| Parse Trial Balance (AOA) | `n8n-nodes-base.code` | /lib/xero/trialBalance.ts -> fetchTrialBalance(endDate) |
| HTTP Request — Trial Balance (Xero) | `n8n-nodes-base.httpRequest` | /lib/xero/trialBalance.ts -> fetchTrialBalance(endDate) |
| Ensure TB date (ISO) | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Excel2 | `@bitovi/n8n-nodes-excel.excel` | /lib/excel/buildWorkbooks.ts (ExcelJS) |
| Save workbook1 | `n8n-nodes-base.code` | /lib/excel/workbookState.ts |
| Carry workbook | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Sanitize AOA | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Edit Fields1 | `n8n-nodes-base.set` | /lib/http/shapeRequest.ts |
| Build where | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Webhook2 | `n8n-nodes-base.webhook` |  |
| HTTP Request — Journals (balances) | `n8n-nodes-base.httpRequest` |  |
| Aggregate balances | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Respond to Webhook2 | `n8n-nodes-base.respondToWebhook` | /app/api/exports/download (response writer) |
| Persist inputs | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Build Analysis Payload | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Parse | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| OpenAI — Analyze file (Responses API) | `n8n-nodes-base.httpRequest` |  |
| Turn the JSON into a “Comments” sheet | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Attach workbook1 | `n8n-nodes-base.code` | /lib/excel/workbookState.ts |
| Excel3 | `@bitovi/n8n-nodes-excel.excel` |  |
| Save workbook3 | `n8n-nodes-base.code` | /lib/excel/workbookState.ts |
| Excel4 | `@bitovi/n8n-nodes-excel.excel` |  |
| Code7 | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Code8 | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| Code9 | `n8n-nodes-base.code` | /lib/... (migrate the snippet into typed functions) |
| OpenAI — Upload TXT | `n8n-nodes-base.httpRequest` |  |
| OpenAI — Create Vector Store | `n8n-nodes-base.httpRequest` |  |
