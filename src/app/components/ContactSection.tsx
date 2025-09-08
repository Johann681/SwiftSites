"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, Mail, MapPin, Clock, Twitter, Github, Linkedin } from "lucide-react";

export default function ContactPage() {
  const containerRef = useRef(null);
  const successRef = useRef(null);

  // form
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message: '' }

  // prefill from localStorage.user (if you used simulated auth earlier)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setForm((s) => ({ ...s, name: u.name || s.name, email: u.email || s.email }));
      }
    } catch (e) {}
  }, []);

  // GSAP entrance animation (dynamic import)
  useEffect(() => {
    let ctx;
    (async () => {
      try {
        const { gsap } = await import("gsap");
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.6 } });
          tl.from(".contact-hero", { opacity: 0, y: 24 });
          tl.from(".contact-card", { opacity: 0, y: 30 }, "-=0.2");
          tl.from(".contact-left .field", { opacity: 0, y: 18, stagger: 0.08 }, "-=0.3");
          tl.from(".contact-cta", { opacity: 0, scale: 0.98 }, "-=0.2");
        }, containerRef);
      } catch (err) {
        // no-op if GSAP fails
      }
    })();
    return () => ctx?.revert?.();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.message.trim()) return "Please include a short message about your project.";
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const v = validate();
    if (v) {
      setStatus({ type: "error", message: v });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Failed to send.");
      }
      setStatus({ type: "success", message: "Thanks — we received your message. We'll reply within 24 hours." });
      // keep name/email but clear message/company
      setForm((s) => ({ ...s, company: "", message: "" }));
      // focus success region for screen readers
      setTimeout(() => successRef.current?.focus?.(), 50);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center contact-hero">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Let’s build something that ships — fast.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about your project, timeline, and goals. We’ll recommend the fastest, most secure template or a custom route if you need it.
          </p>
        </div>
      </section>

      {/* Card container */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative contact-card bg-black rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
            {/* subtle decorative gradient */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-700/30 to-purple-700/10 opacity-30 blur-xl"></div>

            <div className="grid gap-8 md:grid-cols-2 items-start">
              {/* LEFT: form */}
              <div className="contact-left bg-transparent">
                <div className="max-w-xl">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">Get an expert recommendation</h2>
                  <p className="mt-3 text-gray-200">
                    Share a few details and we'll reply with a recommended template, estimated timeline, and next steps.
                  </p>

                  <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="field block">
                        <span className="sr-only">Full name</span>
                        <input
                          name="name"
                          value={form.name}
                          onChange={onChange}
                          placeholder="Full name"
                          className={cn(
                            "w-full rounded-lg px-4 py-3 text-sm bg-white/6 text-white placeholder:text-white/60 focus:outline-none",
                            "ring-0 focus:ring-2 focus:ring-blue-400"
                          )}
                          aria-label="Full name"
                        />
                      </label>

                      <label className="field block">
                        <span className="sr-only">Email</span>
                        <input
                          name="email"
                          value={form.email}
                          onChange={onChange}
                          placeholder="you@company.com"
                          type="email"
                          className={cn(
                            "w-full rounded-lg px-4 py-3 text-sm bg-white/6 text-white placeholder:text-white/60 focus:outline-none",
                            "ring-0 focus:ring-2 focus:ring-blue-400"
                          )}
                          aria-label="Email"
                        />
                      </label>
                    </div>

                    <label className="field block">
                      <span className="sr-only">Company (optional)</span>
                      <input
                        name="company"
                        value={form.company}
                        onChange={onChange}
                        placeholder="Company (optional)"
                        className={cn(
                          "w-full rounded-lg px-4 py-3 text-sm bg-white/6 text-white placeholder:text-white/60 focus:outline-none",
                          "ring-0 focus:ring-2 focus:ring-blue-400"
                        )}
                        aria-label="Company (optional)"
                      />
                    </label>

                    <label className="field block">
                      <span className="sr-only">Message</span>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        placeholder="Describe your goals, deadline, and any must-haves..."
                        rows={6}
                        className={cn(
                          "w-full rounded-xl px-4 py-3 text-sm bg-white/6 text-white placeholder:text-white/60 focus:outline-none resize-none",
                          "ring-0 focus:ring-2 focus:ring-blue-400"
                        )}
                        aria-label="Message"
                      />
                    </label>

                    {status && (
                      <div
                        tabIndex={-1}
                        ref={successRef}
                        role="status"
                        aria-live="polite"
                        className={cn(
                          "rounded-md px-3 py-2 text-sm",
                          status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                        )}
                      >
                        {status.message}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="contact-cta rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3"
                      >
                        {loading ? "Sending..." : "Send message"}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm({ name: "", email: "", company: "", message: "" });
                          setStatus(null);
                        }}
                        className="px-4 py-2 rounded-full bg-white/6 text-white text-sm hover:bg-white/10 transition"
                      >
                        Reset
                      </button>
                    </div>

                    <p className="mt-4 text-xs text-white/60">
                      By contacting us you agree to our <a className="underline" href="/terms">terms</a>.
                    </p>
                  </form>
                </div>
              </div>

              {/* RIGHT: quick contact methods + image */}
              <aside className="contact-right flex flex-col gap-6">
                <div className="grid gap-4">
                  <ContactMethod
                    icon={Phone}
                    title="Call us"
                    subtitle="+1 (555) 123-4567"
                    desc="Mon–Fri • 9:00–18:00 (GMT)"
                  />
                  <ContactMethod
                    icon={Mail}
                    title="Email"
                    subtitle="support@swiftsites.com"
                    desc="Typical reply time: <24 hours"
                  />
                  <ContactMethod
                    icon={MapPin}
                    title="Office"
                    subtitle="123 Swift St, Suite 100"
                    desc="Lagos, Nigeria"
                  />
                </div>

                {/* image / trust badges */}
                <div className="mt-4 rounded-xl overflow-hidden">
                  <div className="relative w-full h-44 rounded-xl bg-white/6">
                    <Image src="/golive.png" alt="example preview" fill className="object-cover" />
                  </div>
                </div>

                {/* socials */}
                <div className="mt-4 flex items-center gap-3">
                  <a className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center hover:bg-white/10" href="#">
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center hover:bg-white/10" href="#">
                    <Github className="w-5 h-5 text-white" />
                  </a>
                  <a className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center hover:bg-white/10" href="#">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                </div>

                <div className="mt-4 text-sm text-white/60">
                  <strong>Prefer faster?</strong>
                  <p className="mt-1">Schedule a 20-min intro call and we’ll walk you through templates/recommendations.</p>
                  <a className="inline-block mt-3 text-sm underline text-white" href="/schedule">Book a call →</a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* small subcomponent for contact methods */
function ContactMethod({ icon: Icon, title, subtitle, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-white">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-white font-semibold">{title}</div>
        <div className="text-white/90 mt-1">{subtitle}</div>
        <div className="text-white/60 text-sm mt-1">{desc}</div>
      </div>
    </div>
  );

}
