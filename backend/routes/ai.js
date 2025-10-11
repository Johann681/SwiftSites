import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/ai", async (req, res) => {
  try {
    console.log("📥 Incoming AI request:", req.body);

    const { type, conversation, brief } = req.body;

    // --- Case 1: Chat mode ---
    if (type === "chat") {
      const userMessages = conversation.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // ✅ Updated to current model
        messages: [
          {
            role: "system",
            content:
              "You are SwiftSites' AI design assistant. Help users refine website briefs in a helpful, natural way.",
          },
          ...userMessages,
        ],
      });

      const aiText =
        completion.choices[0]?.message?.content?.trim() ||
        "⚠️ No reply from AI.";
      return res.json({ text: aiText });
    }

    // --- Case 2: Final brief mode ---
    if (type === "final") {
      const { companyName, industry, budget, style, description } = brief;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // ✅ Updated here too
        messages: [
          {
            role: "system",
            content:
              "You are a professional website strategist at SwiftSites. Generate a clear, persuasive final project proposal based on this brief.",
          },
          {
            role: "user",
            content: `
Company: ${companyName}
Industry: ${industry}
Budget: ${budget}
Style: ${style}
Goals: ${description}
`,
          },
        ],
      });

      const aiText =
        completion.choices[0]?.message?.content?.trim() ||
        "⚠️ No final proposal generated.";
      return res.json({ text: aiText });
    }

    return res.status(400).json({ error: "Invalid request type." });
  } catch (err) {
    console.error("❌ AI route error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
