"use client";

import { useState } from "react";

const FORM_ENDPOINT = "https://formspree.io/f/xnnzkkdr"; // change if needed
const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // put your demo link here (YouTube/Vimeo embed URL)

export default function LandingPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErrorMsg(
        data?.errors?.[0]?.message ||
          "Something went wrong. Please try again or email us directly."
      );
      setStatus("error");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Topbar */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900" />
            <span className="font-semibold tracking-tight">workpaperly</span>
          </a>
          <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero (video on the right — temporarily hidden via Option A) */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
            Accounts preparation, done in hours not weeks.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            AI-powered workpapers that cut up to 70% of accounts
            preparation time.
          </p>
          <p className="mt-4 text-slate-600">
            Connect your accounting software or upload manual records. AI generates a Trial Balance,
            lead schedules, and per-nominal tabs to assist with accounts preparation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="px-5 py-3 rounded-xl bg-slate-900 text-white shadow-sm hover:shadow transition">
              Contact
            </a>
            <a href="#how" className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-white">
              How it works
            </a>
          </div>


        </div>

        {/* Video (temporarily hidden) */}
        {false && (
          <div className="md:col-span-5">
            <div id="demo" className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`${VIDEO_URL}?rel=0&modestbranding=1`}
                  title="Product demo video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-6 py-8 grid md:grid-cols-3 gap-6">
        {[
          { title: "Automatic workpaper preparation", text: "AI drafts the workpapers - TB, lead schedules, and nominal tabs prepared ready for review." },
          { title: "Save time on accounts prep", text: "Teams report up to 70% less manual work across accounts preparation." },
          { title: "Smart suggestions", text: "Narratives, variance notes and flags for unusual movements to guide your review." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-slate-600 mt-2 text-sm">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Auto workpaper pack",
            text: "Trial Balance + nominal tabs, inclusive end-date logic, and complete line-level detail for traceability.",
          },
          {
            title: "AI lead schedules",
            text: "Fixed assets, accruals, prepayments and control accounts drafted from transactions and prior-year patterns.",
          },
          {
            title: "AI variance notes",
            text: "Draft commentary on movements and unusual entries.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-slate-600 mt-2 text-sm">{f.text}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-xl font-semibold">How it works</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Connect or upload", text: "Connect your accounting software or manual records." },
            { step: "2", title: "Pick your period", text: "Select the start and end dates and target accounts." },
            { step: "3", title: "Generate & review", text: "AI assembles the Excel pack with a TB, nominal tabs, lead schedules, and notes for your review." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center">{s.step}</div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">Get early access</h2>
          <p className="mt-2 text-slate-600">Tell us about your firm and we’ll share a short walkthrough + pricing.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-slate-700">Name</label>
                <input name="name" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div>
                <label className="block text-sm text-slate-700">Work Email</label>
                <input type="email" name="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-700">Company</label>
              <input name="company" className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
            <div>
              <label className="block text-sm text-slate-700">What would you like to automate?</label>
              <textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="e.g., Year-end workpapers from TB + journals" />
            </div>
            <input type="hidden" name="subject" value="New access request" />
            <input type="hidden" name="source" value="landing-page" />

            <div className="flex items-start gap-3">
              <input id="consent" type="checkbox" name="consent" required className="mt-1 h-5 w-5 rounded border-slate-300" />
              <label htmlFor="consent" className="text-sm text-slate-600">
                I agree to be contacted and accept the <a href="#" className="underline">privacy policy</a>.
              </label>
            </div>

            <button
              disabled={status === "loading"}
              className="w-full md:w-auto rounded-xl bg-slate-900 text-white px-6 py-3 disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Request access"}
            </button>

            {status === "success" && (
              <p className="text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                Thanks! We’ll be in touch shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{errorMsg}</p>
            )}
          </form>
        </div>
      </section>

                {/* Footer */}
              <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} Workpaperly Ltd • All rights reserved</p>
                <div className="flex gap-5">
                  <a href="https://workpaperly.com" className="underline" target="_blank" rel="noreferrer">workpaperly.com</a>
                  <a href="mailto:jozef@workpaperly.com" className="underline">Contact</a>
                  <a href="/privacy" className="underline">Privacy</a>
                </div>
              </footer>

    </div>
  );
}
