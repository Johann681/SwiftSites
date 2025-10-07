"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "👋 Hi there! I’m your AI Design Assistant. Tell me a bit about your business and budget, and I’ll suggest the best website plan for you." },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    // Temporary AI response (we'll connect the real backend later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text:
            "Got it! Based on what you said, I’d recommend our Business Plan — it includes a custom homepage, gallery, and contact page. Would you like me to prepare a quote?",
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-3 shadow-lg bg-white hover:bg-gray-100"
        >
          <MessageCircle className="text-gray-800" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-sm">
                AI Design Assistant
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl text-sm ${
                      msg.from === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    } max-w-[80%]`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                size="icon"
                onClick={handleSend}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
