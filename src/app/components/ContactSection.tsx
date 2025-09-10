"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, Mail, MapPin, Twitter, Github, Linkedin } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type Status = { type: "success" | "error"; message: string } | null;

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw) as { name?: string; email?: string };
        setForm((s) => ({ ...s, name: u.name || s.name, email: u.email || s.email }));
      }
    } catch {}
  }, []);

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      if (!res.ok) throw new Error("Failed to send.");
      setStatus({ type: "success", message: "We got your message! Expect a reply in 24h 🚀" });
      setForm((s) => ({ ...s, company: "", message: "" }));
      setTimeout(() => successRef.current?.focus?.(), 50);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-16 text-center px-6"
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Let’s build something{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            remarkable
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-500 max-w-xl mx-auto">
          Share your project, timeline, and goals — we’ll recommend the fastest, most secure approach or a tailored solution.
        </p>
      </motion.section>

      {/* Contact Section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-medium">Get an expert recommendation</h2>
            <p className="text-gray-500 text-sm">We’ll reply within <strong>24 hours</strong>.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="First Name"
                className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-sm"
              />
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                type="email"
                className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-sm"
              />
            </div>

            <input
              name="company"
              value={form.company}
              onChange={onChange}
              placeholder="Company (optional)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-sm"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Your message..."
              rows={5}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm resize-none text-sm"
            />

            {status && (
              <motion.div
                ref={successRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "rounded-md px-3 py-2 text-sm",
                  status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}
              >
                {status.message}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 text-sm transition shadow-sm"
            >
              {loading ? "Sending..." : "Send message"}
            </Button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <ContactMethod icon={Phone} title="Call us" subtitle="+1 (555) 123-4567" desc="Mon–Fri • 9:00–18:00" small />
              <ContactMethod icon={Mail} title="Email" subtitle="support@swiftsites.com" desc="Reply <24h" small />
              <ContactMethod icon={MapPin} title="Office" subtitle="123 Swift St" desc="Lagos, Nigeria" small />
            </div>

            <div className="rounded-lg overflow-hidden shadow-md">
              <Image src="/golive.png" alt="Go Live Preview" width={500} height={250} className="object-cover w-full h-56" />
            </div>

            <div className="flex gap-3 mt-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition shadow-sm"
                >
                  <Icon className="w-4 h-4 text-gray-700" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function ContactMethod({
  icon: Icon,
  title,
  subtitle,
  desc,
  small,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  desc: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
          small ? "bg-gray-100 text-indigo-500" : "bg-gray-100 text-indigo-600"
        )}
      >
        <Icon className={small ? "w-4 h-4" : "w-6 h-6"} />
      </div>
      <div>
        <div className={cn("font-medium", small ? "text-sm text-gray-900" : "text-gray-900")}>{title}</div>
        <div className={cn(small ? "text-xs text-gray-500" : "text-gray-500")}>{subtitle}</div>
        <div className={cn(small ? "text-xs text-gray-400" : "text-sm text-gray-400")}>{desc}</div>
      </div>
    </div>
  );
}
