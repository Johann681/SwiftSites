"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AuthForm (Framer Motion + indigo styling + toast)
 * - Register -> switches to Login with toast and focuses email
 * - Login -> stores token & redirects to "/"
 *
 * env: NEXT_PUBLIC_API_URL should be like: http://localhost:4000/api
 */

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]); // simple toast queue

  // fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // register only
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // build API base
  const RAW_API = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL || "" : "";
  const API = RAW_API.replace(/\/+$/, "");

  useEffect(() => {
    // focus email on mount for convenience
    if (emailRef.current) emailRef.current.focus();
  }, []);

  function pushToast({ id, text, tone = "success", ttl = 2800 }) {
    const toast = { id: id || Date.now(), text, tone };
    setToasts((t) => [...t, toast]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== toast.id));
    }, ttl);
  }

  function resetMessages() {
    setError("");
  }

  function validateEmail(e) {
    return /^\S+@\S+\.\S+$/.test(e);
  }

  async function safeParse(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { message: text || `HTTP ${res.status}`, _rawText: text };
    }
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    resetMessages();

    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (mode === "register") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (!API) {
      setError("API base not set. Add NEXT_PUBLIC_API_URL to .env.local");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? `${API}/users/login` : `${API}/users/register`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await safeParse(res);

      if (!res.ok) {
        const msg = data?.message || data?.error || `Request failed (${res.status})`;
        setError(msg);
        setLoading(false);
        return;
      }

      if (mode === "register") {
        // switch to login tab and show toast + focus email
        setMode("login");
        pushToast({ text: "Registered successfully. Please login." });
        setPassword("");
        setConfirmPassword("");
        setPhone("");
        setTimeout(() => {
          if (emailRef.current) emailRef.current.focus();
        }, 80);
        setLoading(false);
        return;
      }

      // login success: store and redirect home
      // ✅ login success: store user data & token (unified key for backend)
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      // use consistent token key so backend & other pages find it
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // optional cleanup of any old keys
      localStorage.removeItem("userToken");
      
      pushToast({ text: "Welcome back!", tone: "success", ttl: 700 });
      
      // short delay so toast can show
      setTimeout(() => {
        window.location.href = "/";
      }, 550);
      
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Check backend & CORS.");
    } finally {
      setLoading(false);
    }
  };

  // motion variants
  const containerVariants = {
    initial: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.99 }),
    animate: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.15 } }),
  };

  const isLogin = mode === "login";
  const dir = isLogin ? 1 : -1; // used by variants for direction

  return (
    <div className="min-h-fit py-6 px-4 sm:px-6">
      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="max-w-md mx-auto bg-white shadow-xl rounded-2xl border border-indigo-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-2xl font-semibold text-indigo-700">{isLogin ? "Welcome back" : "Create account"}</h3>
              <p className="text-sm text-indigo-500 mt-1">Securely access SwiftSites</p>
            </div>

            <div className="hidden sm:flex items-center">
              <div
                className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium"
                aria-hidden
              >
                SwiftSites
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 bg-indigo-50 p-1 rounded-full inline-flex">
            <button
              onClick={() => { setMode("login"); resetMessages(); }}
              className={`px-4 py-2 rounded-full text-sm font-medium ${isLogin ? "bg-indigo-600 text-white shadow" : "text-indigo-700/90"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("register"); resetMessages(); }}
              className={`px-4 py-2 rounded-full text-sm font-medium ${!isLogin ? "bg-indigo-600 text-white shadow" : "text-indigo-700/90"}`}
            >
              Register
            </button>
          </div>

          {/* Animated form body keyed by mode */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.form
              key={mode}
              custom={dir}
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileTap={{ scale: 0.995 }}
              className="space-y-4"
            >
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Email</label>
                <input
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-14"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600/90"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">Confirm password</label>
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      type="password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1">Phone (optional)</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 812 345 6789"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </>
              )}

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-600 text-white font-medium shadow"
                >
                  {loading ? (isLogin ? "Logging in..." : "Creating account...") : (isLogin ? "Login" : "Create account")}
                </motion.button>
              </div>

              <div className="text-sm text-center text-indigo-500">
                {isLogin ? (
                  <span>
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setMode("register")} className="text-indigo-700 font-medium">
                      Register
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{" "}
                    <button type="button" onClick={() => setMode("login")} className="text-indigo-700 font-medium">
                      Login
                    </button>
                  </span>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Toast container (top-right) */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: 20, opacity: 0, scale: 0.98 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={`min-w-[220px] max-w-sm rounded-lg px-4 py-2 shadow-lg border ${
                t.tone === "success" ? "bg-white/95 border-indigo-100" : "bg-white/95 border-red-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.tone === "success" ? "bg-indigo-600 text-white" : "bg-red-500 text-white"}`}>
                  {t.tone === "success" ? "✓" : "!"}
                </div>
                <div className="text-sm text-gray-800">{t.text}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
