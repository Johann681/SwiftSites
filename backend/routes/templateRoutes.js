import express from "express";
import { addTemplate, getTemplates } from "../controllers/templateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route — anyone can view templates
router.get("/", getTemplates);

// Protected route — only admin can add templates
router.post("/", protect, addTemplate);

export default router;
