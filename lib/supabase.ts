// lib/supabase.ts
import { cookies } from "next/headers";
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// For Server Components / pages: use logged-in user's session via cookies
export const serverSupabase = () =>
  createServerComponentClient({ cookies });

// For Route Handlers (app/api/*): use logged-in user's session via cookies
export const routeSupabase = () =>
  createRouteHandlerClient({ cookies });

// For server-only tasks (no user session): uses service role key
// NEVER import this in a client component
export const serviceSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
