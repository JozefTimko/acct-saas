// app/api/xero/_lib/xero.ts
export const runtime = "nodejs";

// TEMP for Phase 1: read token and tenant from env
const ACCESS_TOKEN = process.env.XERO_ACCESS_TOKEN!;
const DEFAULT_TENANT_ID = process.env.XERO_TENANT_ID!;

export function getAuthHeaders(tenantId?: string) {
  return {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: "application/json",
    ...(tenantId || DEFAULT_TENANT_ID ? { "Xero-tenant-id": tenantId || DEFAULT_TENANT_ID } : {})
  };
}

export async function xeroGet(url: string, headers: Record<string, string>) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}