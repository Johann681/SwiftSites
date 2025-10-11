"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * AdminLogin component
 * - Uses NEXT_PUBLIC_API_URL from .env
 * - Posts email/password/adminKey to /admin/login
 * - Stores returned token in localStorage under "adminToken"
 * - Redirects to /admin/dashboard if token exists or login succeeds
 */
export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use env var; fallback to local API if not set
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

  // If token exists, assume admin already logged in and redirect
  useEffect(() => {
    const token = typeof window !== "undefined" && localStorage.getItem("adminToken");
    if (token) {
      router.replace("/Admin_Dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic front-end validation
    if (!email.trim() || !password.trim() || !adminKey.trim()) {
      setError("Email, password and admin key are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, adminKey: adminKey.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend may return { message: "..." }
        setError(data?.message || "Login failed. Check credentials.");
        setLoading(false);
        return;
      }

      // Save token and redirect
      if (data?.token) {
        localStorage.setItem("adminToken", data.token);
        router.push("/Admin_Dashboard");
      } else {
        setError("No token returned from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-8"
        aria-labelledby="admin-login-heading"
      >
        <h1 id="admin-login-heading" className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Admin Login
        </h1>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Sign in with your admin credentials.
        </p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <label className="block mb-3">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Your password"
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-gray-700">Admin Key</span>
          <input
            type="text"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            required
            placeholder="Admin secret key"
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-medium transition ${
            loading ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          SwiftSites admin panel — protected area.
        </p>
      </form>
    </div>
  );
}
