import express from "express";
import Preference from "../models/preference.js";
import User from "../models/user.js";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/preferences
router.post("/", async (req, res) => {
  const { userId, title, description, phone } = req.body;

  if (!userId || !title || !description) {
    return res.status(400).json({ message: "User, title, and description are required" });
  }

  try {
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create preference
    const preference = await Preference.create({
      user: userId,
      title,
      description,
      phone,
    });

    // Optional: send email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any SMTP service
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // admin receives it
      subject: `New Website Preference from ${user.name}`,
      text: `User: ${user.name}\nEmail: ${user.email}\nPhone: ${phone || "Not provided"}\n\nTitle: ${title}\nDescription: ${description}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Email error:", error);
      else console.log("Email sent:", info.response);
    });

    res.status(201).json({
      message: "Preference submitted successfully",
      preference,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
