"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { QUICK_SUGGESTIONS } from "@/lib/constants";

type Brief = {
  companyName: string;
  industry: string;
  budget: string;
  style: string;
  description: string;
};

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  createdAt: number;
};

export default function AiDashboard() {
  const [brief, setBrief] = useState<Brief>({
    companyName: "",
    industry: "",
    budget: "",
    style: "Modern",
    description: "",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const chatRef = useRef<HTMLDivElement | null>(null);

  // Load user id if available
  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem("userInfo");
      const storedToken = localStorage.getItem("token");

      if (storedUserInfo) {
        const parsed = JSON.parse(storedUserInfo);
        if (parsed?._id) {
          setUserId(parsed._id);
          localStorage.setItem("userId", parsed._id);
          return;
        }
      }

      if (storedToken) {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        if (payload.id) {
          setUserId(payload.id);
          localStorage.setItem("userId", payload.id);
        }
      }
    } catch (err) {
      console.warn("⚠️ Failed to load user info:", err);
    }
  }, []);

  // auto-scroll when messages change
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight + 200;
  }, [messages, aiTyping]);

  const change = (key: keyof Brief, value: string) =>
    setBrief((s) => ({ ...s, [key]: value }));

  // Helper: create a compact single-line brief text
  const briefToText = (b: Brief) =>
    `Brief • ${b.companyName || "Untitled"} — ${b.industry || "—"} | ${
      b.budget || "—"
    } | ${b.style || "—"} — ${b.description || "—"}`;

  // Heuristic: detect if the AI asked to send the final brief
  const aiAskedToSend = (text: string) => {
    const trigger =
      /(would you like me to send|shall i send|ready to send|send (the )?(final )?(brief|proposal|plan))/i;
    return trigger.test(text);
  };

  // Send a conversation message (user typed) -> calls backend
  const sendMessageToAI = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: messageText,
      createdAt: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      setAiTyping(true);

      // Post conversation + new message to backend
      // Backend should accept { type: "chat", conversation: [...messages, userMsg] }
      const res = await fetch("http://localhost:4000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          conversation: [...messages, userMsg].map((x) => ({
            role: x.sender,
            text: x.text,
          })),
        }),
      });

      const json = await res.json();
      const aiText = json?.text || "⚠️ No reply from AI.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        createdAt: Date.now(),
      };

      setMessages((m) => [...m, aiMsg]);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "⚠️ Error contacting AI. Try again.",
        createdAt: Date.now(),
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setAiTyping(false);
      setLoading(false);
    }
  };

  // Start a conversation by sending the brief as the first message
  const startConversation = async () => {
    const text = briefToText(brief);
    await sendMessageToAI(text);
  };

  // If the AI asked to send, this will post only the structured brief to backend for finalization
  const sendFinalBriefToAIForProposal = async () => {
    setLoading(true);
    try {
      // POST only the structured brief with type: "final"
      const res = await fetch("http://localhost:4000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "final", brief }),
      });

      const json = await res.json();
      const finalText = json?.text || "⚠️ No final proposal returned.";

      // Append AI final proposal to chat
      const aiMsg: ChatMessage = {
        id: `ai-final-${Date.now()}`,
        sender: "ai",
        text: finalText,
        createdAt: Date.now(),
      };
      setMessages((m) => [...m, aiMsg]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "⚠️ Error creating final proposal.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Once final proposal exists, send it to admin (your existing /api/preferences)
  const sendToAdmin = async (aiMessage: ChatMessage) => {
    if (!userId) {
      alert("❌ You must be logged in first.");
      return;
    }

    try {
      setSending(true);
      const res = await fetch("http://localhost:4000/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: `Project: ${brief.companyName || "New Lead"}`,
          description: aiMessage.text,
          phone: "08012345678",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send.");

      alert("✅ Preference successfully sent to admin!");
    } catch (err: any) {
      alert("❌ Error sending preference: " + (err?.message || err));
    } finally {
      setSending(false);
    }
  };

  // UI: determine if any latest AI message asked to send
  const latestAiMessageThatAsksToSend = (): ChatMessage | null => {
    // find last AI message that matches the ask pattern
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.sender === "ai" && aiAskedToSend(m.text)) return m;
    }
    return null;
  };

  // Quick suggestions handler: prefill brief and start conv
  const handleQuick = async (title: string) => {
    const mapping: Record<string, Partial<Brief>> = {
      "Portfolio Site": {
        industry: "Creative / Portfolio",
        style: "Minimal",
        budget: "₦40k–₦100k",
      },
      "E-Commerce": {
        industry: "Retail / E-commerce",
        style: "Modern",
        budget: "₦150k–₦400k",
      },
      "Restaurant / Food": {
        industry: "Food & Beverage",
        style: "Warm",
        budget: "₦60k–₦150k",
      },
      "Business Website": {
        industry: "Corporate",
        style: "Professional",
        budget: "₦50k–₦200k",
      },
    };
    const preset = mapping[title] ?? {};
    const payload = { ...brief, ...preset } as Brief;
    setBrief(payload);
    // send the brief as a message
    await sendMessageToAI(briefToText(payload));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl p-6 shadow grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-indigo-600 w-5 h-5" />
              AI Design Companion — Chat
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Chat with the AI to refine your brief. When the AI says it's
              ready, confirm and it will send only the structured brief to your
              backend for a final proposal.
            </p>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-indigo-700 mb-2">
              Quick Suggestions
            </h3>
            <div className="flex flex-col gap-2">
              {QUICK_SUGGESTIONS.map((q) => (
                <button
                  key={q.title}
                  onClick={() => handleQuick(q.title)}
                  className="text-left p-3 rounded-xl bg-white shadow-sm hover:shadow-md text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{q.title}</span>
                    <span className="text-xs text-gray-500">{q.estimated}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{q.short}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: brief form */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Project Brief</h2>
          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-600 mb-1">Company / Brand</span>
            <input
              value={brief.companyName}
              onChange={(e) => change("companyName", e.target.value)}
              className="p-3 border rounded"
              placeholder="Bubey's Bite"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-600 mb-1">Industry</span>
            <input
              value={brief.industry}
              onChange={(e) => change("industry", e.target.value)}
              className="p-3 border rounded"
              placeholder="Food & Beverage"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-600 mb-1">Budget</span>
            <input
              value={brief.budget}
              onChange={(e) => change("budget", e.target.value)}
              className="p-3 border rounded"
              placeholder="₦60k–₦150k"
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-600 mb-1">Style</span>
            <select
              value={brief.style}
              onChange={(e) => change("style", e.target.value)}
              className="p-3 border rounded"
            >
              <option>Modern</option>
              <option>Minimal</option>
              <option>Elegant</option>
              <option>Warm</option>
              <option>Bold</option>
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-xs text-gray-600 mb-1">
              Goals / Description
            </span>
            <textarea
              value={brief.description}
              onChange={(e) => change("description", e.target.value)}
              rows={4}
              className="p-3 border rounded"
              placeholder="Increase orders and show menu"
            ></textarea>
          </label>

          <div className="flex gap-2">
            <button
              onClick={startConversation}
              className="flex-1 bg-indigo-600 text-white py-2 rounded flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Start Conversation
            </button>
            <button
              onClick={() => {
                setMessages([]);
                setInput("");
              }}
              className="px-4 py-2 border rounded"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            className="bg-white rounded-2xl shadow p-4 flex flex-col"
            style={{ minHeight: 480 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Conversation</h3>
              <div className="text-xs text-gray-500">
                {aiTyping
                  ? "AI is typing..."
                  : loading
                  ? "Sending..."
                  : `${messages.length} messages`}
              </div>
            </div>

            <div
              ref={chatRef}
              className="flex-1 overflow-auto space-y-3 px-2 py-1"
            >
              {messages.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No messages yet — start by sending the brief.
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${
                        m.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      } p-3 max-w-[82%] whitespace-pre-wrap rounded-2xl text-sm`}
                    >
                      <div className="mb-2">{m.text}</div>
                      {m.sender === "ai" && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => sendToAdmin(m)}
                            disabled={sending}
                            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded"
                          >
                            {sending ? "Sending..." : "Send to Admin"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                ))
              )}

              {aiTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-2 rounded-2xl text-xs text-gray-600">
                    ...
                  </div>
                </div>
              )}
            </div>

            {/* If AI recently asked to send, show confirm banner */}
            {latestAiMessageThatAsksToSend() && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded flex items-center justify-between">
                <div className="text-sm">
                  The AI asked to send the finalized brief. Do you want to
                  generate the final proposal and send the structured brief to
                  the backend?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={sendFinalBriefToAIForProposal}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Yes, generate & send
                  </button>
                  <button
                    onClick={() => {
                      /* user may want to continue editing */
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Not yet
                  </button>
                </div>
              </div>
            )}

            {/* message input */}
            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessageToAI(input);
                  }
                }}
                placeholder="Message the AI (e.g. make it more premium)..."
                className="flex-1 p-3 border rounded"
              />
              <button
                onClick={() => sendMessageToAI(input)}
                disabled={!input.trim() || loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>

          {/* small help / tips card */}
          <div className="bg-white rounded-2xl shadow p-4 text-sm text-gray-700">
            <p>
              <strong>Flow:</strong> Start with the brief → chat with AI → when
              AI asks, confirm to send the structured brief → receive final
              proposal → optionally forward to admin.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              All backend calls go to <code>/api/ai</code> (chat & final) and{" "}
              <code>/api/preferences</code> (send to admin).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
