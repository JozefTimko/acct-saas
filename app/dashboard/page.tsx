import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase";

export default async function DashboardPage() {
  const supabase = serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-slate-600 mt-2">Welcome, {user.email}</p>
    </main>
  );
}