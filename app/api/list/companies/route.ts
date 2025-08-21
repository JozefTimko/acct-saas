import { routeSupabase } from "@/lib/supabase";
export async function GET() {
  const supabase = routeSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { data } = await supabase.from("companies").select("id,name");
  return Response.json(data ?? []);
}