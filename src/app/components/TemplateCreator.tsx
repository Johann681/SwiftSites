"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type TemplateCreatorProps = {
  onCreated?: (res?: unknown) => void;
};

export default function TemplateCreator({ onCreated }: TemplateCreatorProps = {}) {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const validate = () => {
    if (!title.trim() || !description.trim() || !image.trim() || !demoLink.trim()) {
      setMessage({ type: "error", text: "Title, description, image URL and demo link are required." });
      return false;
    }
    try {
      new URL(image);
      new URL(demoLink);
    } catch {
      setMessage({ type: "error", text: "Image and Demo Link must be valid URLs." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage({ type: "error", text: "Not authenticated. Please login again." });
        return;
      }

      const payload = { title, description, image, demoLink, category: category || "General" };

      const res = await fetch(`${API_URL}/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data?.message || "Failed to create template." });
      } else {
        setMessage({ type: "success", text: "Template created successfully." });
        setTitle(""); setDescription(""); setImage(""); setDemoLink(""); setCategory("");
        onCreated?.(data);
      }
    } catch (err) {
      console.error("Template creation error:", err);
      setMessage({ type: "error", text: "Server error while creating template." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-md max-w-4xl mx-auto space-y-6"
    >
      <header className="space-y-1">
        <h3 className="text-xl font-semibold text-slate-800">Post a Template</h3>
        <p className="text-sm text-slate-500">Create a new template users can browse — add a demo link and image.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className={`p-3 rounded text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Template title" className="w-full p-4 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none" required />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g. Portfolio, Business)" className="w-full p-4 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
        </div>

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (what makes this template special)" className="w-full p-4 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none" rows={4} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (https://...)" className="w-full p-4 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none" required />
          <input value={demoLink} onChange={(e) => setDemoLink(e.target.value)} placeholder="Demo link (https://...)" className="w-full p-4 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none" required />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className={`px-6 py-3 rounded-md text-white font-medium ${loading ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {loading ? "Posting..." : "Create template"}
          </button>
          <button type="button" onClick={() => { setTitle(""); setDescription(""); setImage(""); setDemoLink(""); setCategory(""); setMessage(null); }} className="px-5 py-3 rounded-md bg-white border text-slate-700 hover:bg-slate-50">
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-2">
        <h4 className="text-sm text-slate-500 font-medium">Live preview</h4>
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            {image ? (
              <Image
                src={image}
                alt={title || "preview"}
                className="object-cover w-full h-full"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
                priority
              />
            ) : (
              <div className="text-slate-400 text-sm">No image</div>
            )}
       {image ? (
  <Image
    src={image}
    alt={title || "preview"}
    className="object-cover w-full h-full"
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    style={{ objectFit: "cover" }}
    priority
  />
) : (
  <div className="text-slate-400 text-sm">No image</div>
)}

          </div>
          <div className="p-5 flex-1 space-y-1">
            <div className="text-sm text-indigo-600 font-medium">{category || "General"}</div>
            <div className="text-lg font-semibold text-slate-900">{title || "Template title"}</div>
            <p className="text-sm text-slate-600">{description || "Short description appears here."}</p>
            <a href={demoLink || "#"} target="_blank" rel="noreferrer" className="inline-block mt-2 text-indigo-600 hover:underline text-sm">
              {demoLink ? "Open demo" : "Demo link not provided"}
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
