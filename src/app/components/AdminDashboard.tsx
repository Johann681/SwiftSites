"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AdminDashboardProfessional (template form removed)
 * - Indigo-themed, bento layout
 * - "Post Template" now routes to /admin/templates
 * - Inline template form and related state removed
 *
 * Requirements:
 * - Tailwind CSS configured
 * - framer-motion installed: npm i framer-motion
 * - NEXT_PUBLIC_API_URL env var (fallback to http://localhost:5000/api)
 */

export default function AdminDashboardProfessional() {
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  ).replace(/\/$/, "");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPref, setSelectedPref] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // auth & redirect helper
  const goToLogin = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  // fetch users with preference status
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return goToLogin();

      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return goToLogin();

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to load users");
        setUsers([]);
      } else {
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError("Server error while loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // open preference modal by id
  const openPreference = async (id) => {
    if (!id) return;
    setSelectedPref(null);
    setIsModalOpen(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return goToLogin();

      const res = await fetch(`${API_URL}/admin/preference/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return goToLogin();

      const data = await res.json();
      if (!res.ok) {
        setSelectedPref({
          error: data?.message || "Failed to fetch preference",
        });
      } else {
        setSelectedPref(data);
      }
    } catch (err) {
      console.error("openPreference error:", err);
      setSelectedPref({ error: "Server error fetching preference" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  // small animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header: quote inspired by Vagabond */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-indigo-600 italic text-sm">
                “The way is in training — sharpen your path, then walk it.”
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
                Lotus — Dashboard
              </h1>
              <p className="mt-2 text-slate-500 max-w-xl">
                Clean, focused admin cockpit — manage templates, review
                requests, and respond quickly.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:shadow transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left column: Hero + Stats (spans 5/12 on lg) */}
          <motion.div variants={fadeUp} className="lg:col-span-5 space-y-6">
            {/* Hero card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl p-6 shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src="/lotus.png"
                  alt="Lotus avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <div className="text-lg font-bold text-slate-800">
                    Hello, Lotus
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Quick actions and a place to post new templates.
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      href="/templates"
                      className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      Post Template
                    </Link>
                    <a
                      href="#templates"
                      className="px-3 py-2 rounded-md bg-white border text-sm text-slate-700"
                    >
                      Templates
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-xl shadow text-center"
              >
                <div className="text-xs text-slate-400">Users</div>
                <div className="text-2xl font-bold text-slate-900">
                  {users.length}
                </div>
                <div className="text-xs text-indigo-600 mt-1">Manage users</div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-xl shadow text-center"
              >
                <div className="text-xs text-slate-400">Preferences</div>
                <div className="text-2xl font-bold text-slate-900">
                  {users.filter((u) => u.hasSubmittedPreference).length}
                </div>
                <div className="text-xs text-indigo-600 mt-1">
                  Recent requests
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-xl shadow text-center"
              >
                <div className="text-xs text-slate-400">New</div>
                <div className="text-2xl font-bold text-slate-900">—</div>
                <div className="text-xs text-indigo-600 mt-1">Unread</div>
              </motion.div>
            </div>

            {/* Quick actions */}
            <motion.div
              variants={fadeUp}
              className="bg-white p-4 rounded-xl shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Quick actions
                  </div>
                  <div className="text-xs text-slate-500">
                    Common admin tasks
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchUsers}
                    className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded"
                  >
                    Refresh
                  </button>
                  <a
                    href="#templates"
                    className="px-3 py-2 bg-white border rounded text-sm"
                  >
                    Templates
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column: Users grid (spans 7/12 on lg) */}
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Registered Users
                </h3>
                <div className="text-sm text-slate-500">Sorted by newest</div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-500">
                  Loading users…
                </div>
              ) : error ? (
                <div className="py-6 text-center text-red-600">{error}</div>
              ) : users.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  No registered users yet.
                </div>
              ) : (
                // Bento grid: responsive card layout
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {users.map((u) => (
                      <motion.article
                        key={u._id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {u.name || "—"}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {u.email}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-400">
                                  Joined
                                </div>
                                <div className="text-sm text-slate-600">
                                  {new Date(u.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="text-xs text-slate-500">
                                {u.phone ? (
                                  <span className="text-slate-700">
                                    {u.phone}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">
                                    No phone
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {u.hasSubmittedPreference ? (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-indigo-50 text-indigo-700">
                                    Submitted
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-500">
                                    —
                                  </span>
                                )}

                                <button
                                  onClick={() =>
                                    u.preferenceId
                                      ? openPreference(u.preferenceId)
                                      : null
                                  }
                                  disabled={!u.preferenceId}
                                  className={`ml-2 px-3 py-1 rounded-md text-sm font-medium transition ${
                                    u.preferenceId
                                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  }`}
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal for preference details */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.98, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]"
            >
              <div className="p-5 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Preference details
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedPref(null);
                    }}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-6">
                {!selectedPref ? (
                  <div className="text-center text-slate-500 py-10">
                    Loading…
                  </div>
                ) : selectedPref.error ? (
                  <div className="text-red-600">{selectedPref.error}</div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-400">User</div>
                      <div className="text-sm font-medium text-slate-800">
                        {selectedPref.user?.name} —{" "}
                        <span className="text-slate-500">
                          {selectedPref.user?.email}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">Title</div>
                      <div className="text-base text-slate-800">
                        {selectedPref.title}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">Description</div>
                      <div className="text-sm text-slate-700 whitespace-pre-line">
                        {selectedPref.description}
                      </div>
                    </div>

                    {selectedPref.image && (
                      <div>
                        <div className="text-xs text-slate-400">
                          Image / URL
                        </div>
                        <div>
                          <a
                            href={selectedPref.image}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {selectedPref.image}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
