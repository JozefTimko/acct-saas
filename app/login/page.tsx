"use client";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-slate-600 mt-2">We’ll email you a secure link (placeholder).</p>
      <form className="mt-6 grid gap-4" onSubmit={(e)=>e.preventDefault()}>
        <input
          type="email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="you@firm.com"
          className="rounded-xl border px-4 py-3"
        />
        <button className="rounded-xl bg-slate-900 text-white px-6 py-3">
          Send magic link
        </button>
      </form>
    </main>
  );
}