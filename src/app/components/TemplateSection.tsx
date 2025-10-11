"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Project / Template type
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  screenshots: string[];
  demoUrl: string;
}

// Dummy projects
const dummyProjects: Project[] = [
  {
    id: 1,
    title: "Modern Portfolio",
    category: "Portfolio",
    description: "A sleek website for designers and creatives.",
    coverImage: "/2.png",
    screenshots: ["/c3.png", "/c4.png", "/c1.png", "/c2.png"],
    demoUrl: "https://demo.example.com/portfolio-modern",
  },
  {
    id: 2,
    title: "Startup Landing",
    category: "Business",
    description: "Landing page for SaaS and startups.",
    coverImage: "/3.png",
    screenshots: ["/t1.png", "/t2.png", "/t3.png", "/t6.png"],
    demoUrl: "https://demo.example.com/startup-landing",
  },
  {
    id: 3,
    title: "E-Commerce Store",
    category: "E-Commerce",
    description: "A modern shopping experience.",
    coverImage: "/4.png",
    screenshots: ["/b1.png", "/b2.png", "/b3.png"],
    demoUrl: "https://demo.example.com/ecommerce-store",
  },
];

export default function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [templates, setTemplates] = useState<Project[]>(dummyProjects);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // ⛓️ Fetch templates from backend and merge with dummy data
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("http://localhost:4000/api/templates");
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();

        type BackendTemplate = {
          title: string;
          category?: string;
          description: string;
          image: string;
          demoLink: string;
        };

        const formatted = (data as BackendTemplate[]).map((t, index: number) => ({
          id: dummyProjects.length + index + 1,
          title: t.title,
          category: t.category || "General",
          description: t.description,
          coverImage: t.image,
          screenshots: [t.image],
          demoUrl: t.demoLink,
        }));

        // merge database templates with dummy
        setTemplates([...formatted, ...dummyProjects]);
      } catch (error) {
        console.error("Error loading templates:", error);
      }
    }

    fetchTemplates();
  }, []);

  // Scroll lock
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
      lastActiveRef.current = document.activeElement as HTMLElement;
      setTimeout(() => modalRef.current?.focus?.(), 50);
    } else {
      document.body.style.overflow = "";
      lastActiveRef.current?.focus?.();
    }
  }, [selected]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!selected) return;
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") {
        setCurrentImg(
          (c) => (c - 1 + selected.screenshots.length) % selected.screenshots.length
        );
      }
      if (e.key === "ArrowRight") {
        setCurrentImg((c) => (c + 1) % selected.screenshots.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="relative bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            My Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A selection of my latest work — websites, applications, and designs.
            Click any project to explore details and screenshots.
          </p>
        </div>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {templates.map((proj, idx) => (
            <motion.article
              key={proj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group relative shadow-md hover:shadow-xl transition overflow-hidden bg-white border cursor-pointer"
              onClick={() => {
                setSelected(proj);
                setCurrentImg(0);
              }}
            >
              <div className="relative w-full h-[260px] bg-gray-100">
                <Image
                  src={proj.coverImage}
                  alt={proj.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {proj.title}
                </h3>
                <p className="text-sm text-gray-500">{proj.category}</p>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {proj.description}
                </p>
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(proj);
                    setCurrentImg(0);
                  }}
                  className="w-full rounded-lg bg-black hover:opacity-90 text-white px-4 py-2 text-sm shadow transition"
                >
                  View Project
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="max-w-6xl w-full rounded-2xl overflow-hidden bg-white shadow-2xl"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              tabIndex={-1}
            >
              <div className="grid md:grid-cols-[2fr_1fr]">
                <div className="relative flex flex-col items-center bg-gray-50 p-6">
                  <div className="relative w-full h-[600px] max-h-[80vh] flex items-center justify-center rounded-xl border bg-white shadow">
                    <Image
                      src={selected.screenshots[currentImg]}
                      alt={`${selected.title} screenshot ${currentImg + 1}`}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition"
                      onClick={() =>
                        setCurrentImg(
                          (currentImg - 1 + selected.screenshots.length) %
                            selected.screenshots.length
                        )
                      }
                    >
                      Prev
                    </button>
                    <div className="flex gap-2">
                      {selected.screenshots.map((_, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setCurrentImg(i)}
                          className={`w-3 h-3 rounded-full transition ${
                            i === currentImg ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition"
                      onClick={() =>
                        setCurrentImg(
                          (currentImg + 1) % selected.screenshots.length
                        )
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {selected.title}
                    </h3>
                    <p className="text-base text-gray-600 mt-3 leading-relaxed">
                      {selected.description} Built for{" "}
                      <strong>{selected.category}</strong> with a focus on
                      modern design and responsiveness.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Button
                      onClick={() => window.open(selected.demoUrl, "_blank")}
                      className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6"
                    >
                      View Live Project
                    </Button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
