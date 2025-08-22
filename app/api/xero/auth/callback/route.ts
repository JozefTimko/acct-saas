// app/api/xero/auth/callback/route.ts
async function fetchJSON(url: string, opts: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  // Exchange code for tokens
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.XERO_REDIRECT_URI!,
  });
  const basic = Buffer.from(
    `${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`
  ).toString("base64");

  const token = await fetchJSON("https://identity.xero.com/connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body
  });

  // Find your tenant (org) so you know the tenantId
  const connections = await fetchJSON("https://api.xero.com/connections", {
    headers: { Authorization: `Bearer ${token.access_token}`, Accept: "application/json" },
  });

  const first = Array.isArray(connections) ? connections[0] : null;
  const tenantId = first?.tenantId || "";

  // ⚠️ For quick local testing, we’ll render the values on screen.
  // Do NOT do this in production. Store them in Supabase instead.
  const html = `
    <h1>Tokens received (local dev only)</h1>
    <p><b>access_token</b> (short-lived):</p>
    <pre style="white-space:pre-wrap">${token.access_token}</pre>
    <p><b>refresh_token</b> (longer-lived; keep secret):</p>
    <pre style="white-space:pre-wrap">${token.refresh_token}</pre>
    <p><b>tenantId</b>:</p>
    <pre>${tenantId}</pre>
    <p>Copy <code>access_token</code> and <code>tenantId</code> into <code>.env.local</code> as:</p>
    <pre>XERO_ACCESS_TOKEN=...<br/>XERO_TENANT_ID=${tenantId}</pre>
  `;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
}