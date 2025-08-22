import { routeSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = routeSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { data, error } = await supabase
      .from("companies")
      .select("id,name");

    if (error) return new Response(error.message, { status: 500 });
    return Response.json(data ?? []);
  } catch {
    return Response.json([]);
  }
}