"use client";

import { useState } from "react";

// ✅ How to use this file
// 1) Create a Next.js app (App Router):
//    npx create-next-app@latest landing --ts --tailwind
// 2) Replace the default app/page.tsx with this file's contents.
// 3) Set your Form backend endpoint (FORM_ENDPOINT) below.
//    Quickest: create a free endpoint at Formspree / Getform / Basin and paste the URL.
// 4) Set your VIDEO_URL (YouTube/Vimeo) OR uncomment the <video> block for a self-hosted file.
// 5) Deploy on Vercel. Done.

const FORM_ENDPOINT = "https://formspree.io/f/xnnzkkdr"; // ← replace with your endpoint
const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // ← replace with your video link (YouTube/Vimeo embed)

export default function LandingPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
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
    } catch (err) {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-slate-900" />
          <span className="font-semibold tracking-tight">YourProduct</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#demo" className="hover:text-slate-900">Demo</a>
          <a href="#contact" className="hover:text-slate-900">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">Automation for Accountants, in Minutes—not Months</h1>
          <p className="mt-4 text-slate-600 text-lg">Show a short explainer video and collect leads from firms interested in your n8n-powered workflows.</p>
          <div className="mt-6 flex gap-3">
            <a href="#demo" className="px-5 py-3 rounded-xl bg-slate-900 text-white">Watch the Demo</a>
            <a href="#contact" className="px-5 py-3 rounded-xl border border-slate-300">Get in Touch</a>
          </div>
          <p className="mt-3 text-sm text-slate-500">No credit card needed. UK & EU data handled securely.</p>
        </div>

        {/* Video area */}
        <div id="demo" className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          {/* Option 1: YouTube/Vimeo embed (default) */}
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

          {/* Option 2: Self-hosted video — uncomment to use */}
          {false && (
            <video
              className="w-full h-auto"
              controls
              preload="metadata"
              poster="/demo-poster.jpg" // optional poster image
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </section>

      {/* Features (optional copy) */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-3 gap-6">
        {[
          { title: "For accounting firms", text: "Client onboarding, data pulls, and report generation automated." },
          { title: "Secure & compliant", text: "GDPR-friendly, UK/EU hosting options, SSO-ready." },
          { title: "Fast ROI", text: "Start with one workflow, expand to a full suite as you grow." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-slate-600 mt-2 text-sm">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Contact form */}
      <section id="contact" className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">Get a demo</h2>
          <p className="mt-2 text-slate-600">Tell us a bit about your firm and we’ll send over a short video + pricing.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            {/* Honeypot anti-spam (hidden) */}
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
              <textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="e.g., Pull Xero data and generate month-end workpapers" />
            </div>

            {/* Optional fields for routing */}
            <input type="hidden" name="subject" value="New demo request" />
            <input type="hidden" name="source" value="landing-page" />

            <div className="flex items-start gap-3">
              <input id="consent" type="checkbox" name="consent" required className="mt-1 h-5 w-5 rounded border-slate-300" />
              <label htmlFor="consent" className="text-sm text-slate-600">
                I agree to be contacted about the demo and accept the <a href="#" className="underline">privacy policy</a>.
              </label>
            </div>

            <button
              disabled={status === "loading"}
              className="w-full md:w-auto rounded-xl bg-slate-900 text-white px-6 py-3 disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Request Demo"}
            </button>

            {status === "success" && (
              <p className="text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                Thanks! We’ll be in touch shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {errorMsg}
              </p>
            )}

            <p className="text-xs text-slate-500">Protected by basic anti-spam measures. For heavy traffic, add hCaptcha or Cloudflare Turnstile.</p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} YourCompany Ltd • All rights reserved</p>
        <div className="flex gap-5">
          <a href="#" className="underline">Privacy</a>
          <a href="#" className="underline">Terms</a>
          <a href="#" className="underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}
