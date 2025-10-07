"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

type Brief = {
  companyName: string;
  industry: string;
  budget: string;
  style: string;
  description: string;
};

const QUICK_SUGGESTIONS = [
  { title: "Portfolio Site", short: "Showcase your work & attract clients.", estimated: "₦40k–₦100k", tags: ["Gallery", "Contact", "SEO"] },
  { title: "E-Commerce", short: "Sell online with payments and checkout.", estimated: "₦120k–₦400k", tags: ["Shop", "Cart", "Payments"] },
  { title: "Restaurant / Food", short: "Menu, ordering, and reservations.", estimated: "₦60k–₦150k", tags: ["Menu", "Gallery", "Order"] },
  { title: "Business Website", short: "Corporate branding & contact forms.", estimated: "₦50k–₦200k", tags: ["Services", "Lead Gen", "CTA"] },
];

export default function AiDashboard() {
  const [brief, setBrief] = useState<Brief>({
    companyName: "",
    industry: "",
    budget: "",
    style: "Modern",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [leads, setLeads] = useState<Array<{ id: string; brief: Brief; summary: string }>>([]);
  const mountedRef = useRef(false);

  const change = (k: keyof Brief, v: string) => setBrief((s) => ({ ...s, [k]: v }));

  // --- Generate Plan (mock) ---
  const generatePlan = async (payload?: Brief) => {
    const data = payload ?? brief;
    setLoading(true);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 900));

      const text = [
        `✨ Proposal for ${data.companyName || "Your Business"} ✨`,
        ``,
        `📦 Recommended Package: ${selectPackageFromBudget(data.budget)}`,
        ``,
        `🧭 Concept: A ${data.style.toLowerCase()} ${data.industry || "business"} website focused on growth and conversions.`,
        `💡 Core Sections: Hero + CTA, Services/Menu, Gallery/Products, About, Contact.`,
        `⚙️ Budget Fit: ${estimateText(data.budget)}`,
        ``,
        `🌟 Key Features: ${featureSuggestions(data)}`,
        ``,
        `Would you like to send this proposal to the dev team or refine it further?`,
      ].join("\n");

      setResult(text);
      setShowModal(true);
      const id = `${Date.now()}`;
      setLeads((prev) => [{ id, brief: data, summary: text }, ...prev]);
    } catch {
      setResult("Sorry — an error occurred while generating the plan.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = (title: string) => {
    const mapping: Record<string, Partial<Brief>> = {
      "Portfolio Site": { industry: "Creative / Portfolio", style: "Minimal", budget: "₦40k–₦100k" },
      "E-Commerce": { industry: "Retail / E-commerce", style: "Modern", budget: "₦150k–₦400k" },
      "Restaurant / Food": { industry: "Food & Beverage", style: "Warm", budget: "₦60k–₦150k" },
      "Business Website": { industry: "Corporate", style: "Professional", budget: "₦50k–₦200k" },
    };
    const preset = mapping[title] ?? {};
    const payload = { ...brief, ...preset };
    setBrief(payload);
    generatePlan(payload);
  };

  // --- Helpers ---
  const selectPackageFromBudget = (b: string) => {
    const n = parseBudgetNumber(b);
    if (n === null) return "Starter";
    if (n < 80000) return "Starter";
    if (n < 200000) return "Business";
    return "Premium";
  };
  const estimateText = (b: string) => {
    const p = selectPackageFromBudget(b);
    if (p === "Starter") return "Simple site — fast & affordable.";
    if (p === "Business") return "Balanced scope — great for small biz growth.";
    return "Full-scale package with advanced features.";
  };
  const featureSuggestions = (d: Brief) => {
    const f: string[] = [];
    if (d.industry?.toLowerCase().includes("food")) f.push("Menu + WhatsApp ordering");
    if (d.industry?.toLowerCase().includes("shop")) f.push("Product catalog + checkout");
    if (d.style?.toLowerCase().includes("minimal")) f.push("Large hero section & clean gallery");
    if (!f.length) f.push("Responsive layout + CTA + SEO setup");
    return f.join(", ");
  };
  const parseBudgetNumber = (b: string): number | null => {
    try {
      const digits = b.replace(/[^\d]/g, "");
      if (!digits) return null;
      return Number(digits);
    } catch {
      return null;
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        >
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600 w-6 h-6" />
              Your AI Design Companion
            </h1>
            <p className="mt-3 text-gray-600 max-w-xl">
              Describe your brand and budget — AI will propose a custom website plan you can instantly send to your team.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("brief-form")?.scrollIntoView({ behavior: "smooth" })}
                className="px-5 py-2.5 rounded-full bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
              >
                Start a Project
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Chat with AI
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="bg-indigo-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-indigo-700 mb-2">Quick Suggestions</h3>
            <div className="flex flex-col gap-2">
              {QUICK_SUGGESTIONS.map((q) => (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  key={q.title}
                  onClick={() => handleQuick(q.title)}
                  className="text-left p-3 rounded-xl bg-white shadow-sm hover:shadow-md border border-transparent hover:border-indigo-100 transition"
                >
                  <div className="flex justify-between text-sm font-medium text-gray-900">
                    <span>{q.title}</span>
                    <span className="text-xs text-gray-500">{q.estimated}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{q.short}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {q.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2 space-y-6">
          <form id="brief-form" className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Project Brief</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Company / Brand" placeholder="Bubey’s Bite" value={brief.companyName} onChange={(v) => change("companyName", v)} />
              <Input label="Industry" placeholder="Food & Beverage" value={brief.industry} onChange={(v) => change("industry", v)} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Budget (approx.)" placeholder="₦60k–₦150k" value={brief.budget} onChange={(v) => change("budget", v)} />
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Preferred Style</label>
                <select value={brief.style} onChange={(e) => change("style", e.target.value)} className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400">
                  <option>Modern</option>
                  <option>Minimal</option>
                  <option>Elegant</option>
                  <option>Warm</option>
                  <option>Bold</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => generatePlan()}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  {loading ? "Generating..." : (<><Send className="w-4 h-4" /> Generate</>)}
                </button>
              </div>
            </div>
            <TextArea label="Describe project goals" placeholder="What do you want the website to achieve?" value={brief.description} onChange={(v) => change("description", v)} />
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard title="Inspiration" desc="Examples tailored to your chosen style will appear here. Use them to show clients what’s possible." />
            <InfoCard
              title="Tips"
              desc={
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Keep your hero message short & bold.</li>
                  <li>Use bright, emotional visuals.</li>
                  <li>Ensure your CTA is clear and visible.</li>
                </ul>
              }
            />
          </div>
        </div>

        {/* RIGHT: SUGGESTIONS */}
        <aside className="space-y-4">
          <InfoCard title="AI Suggestions" desc={result ? <pre className="text-sm whitespace-pre-wrap">{result}</pre> : "Generate a plan to see suggestions here."} />

          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Saved Leads</h3>
            {leads.length === 0 ? (
              <p className="text-sm text-gray-500">Leads you generate will appear here.</p>
            ) : (
              <ul className="space-y-3">
                {leads.map((l) => (
                  <li key={l.id} className="p-3 bg-gray-50 rounded-md border">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{l.brief.companyName || "Untitled"}</span>
                      <span className="text-xs text-gray-500">{l.brief.budget}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-3">{l.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-2xl w-full bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Plan Preview</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const subject = encodeURIComponent(`Project: ${brief.companyName || "New Lead"}`);
                    const body = encodeURIComponent(`Brief:\n${JSON.stringify(brief, null, 2)}\n\nAI Summary:\n${result}`);
                    window.location.href = `mailto:you@yourdomain.com?subject=${subject}&body=${body}`;
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Send to Dev
                </button>
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --- Helper Subcomponents --- */
function Input({ label, value, onChange, placeholder }: any) {
  return (
    <label className="flex flex-col">
      <span className="text-xs text-gray-600 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: any) {
  return (
    <label className="flex flex-col">
      <span className="text-xs text-gray-600 mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </label>
  );
}

function InfoCard({ title, desc }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <div className="mt-2 text-sm text-gray-600">{desc}</div>
    </div>
  );
}
