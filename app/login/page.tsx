"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-slate-600 mt-2">We’ll email you a secure link.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@firm.com"
          className="rounded-xl border px-4 py-3"
        />
        <button className="rounded-xl bg-slate-900 text-white px-6 py-3">
          Send magic link
        </button>
        {sent && <p className="text-green-700">Check your inbox.</p>}
        {error && <p className="text-red-700">{error}</p>}
      </form>
    </main>
  );
}