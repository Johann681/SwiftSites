import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import User from "../models/user.js";
import Preference from "../models/preference.js";
import {protect} from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// 🧠 Generate JWT for admin
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * 🧩 Register Admin (one-time setup)
 * Protected by ADMIN_SECRET_KEY
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (adminKey !== process.env.ADMIN_SECRET_KEY)
      return res.status(403).json({ message: "Invalid admin key" });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ email, password });
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 🔐 Login Admin
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (adminKey !== process.env.ADMIN_SECRET_KEY)
      return res.status(403).json({ message: "Invalid admin key" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id);
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// GET /api/admin/preference/:id
router.get("/preference/:id", protect, async (req, res) => {
  try {
    const preferenceId = req.params.id;

    // Find preference by ID and populate user info
    const preference = await Preference.findById(preferenceId).populate("user", "name email phone");

    if (!preference) {
      return res.status(404).json({ message: "Preference not found" });
    }

    res.status(200).json(preference);
  } catch (err) {   // ✅ Use 'err' here instead of undefined 'error'
    console.error("❌ Error fetching preference:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


/**
 * 🖥️ Get all users with preference status
 * Protected route — only accessible by logged-in admin
 */
router.get("/users", protect, async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}).select("name email phone createdAt");

    // Map each user to include preference info
    const usersWithPreferences = await Promise.all(
      users.map(async (user) => {
        const preference = await Preference.findOne({ user: user._id });
        return {
          ...user.toObject(),
          hasSubmittedPreference: !!preference,
          preferenceId: preference?._id || null,
        };
      })
    );

    res.status(200).json(usersWithPreferences);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
