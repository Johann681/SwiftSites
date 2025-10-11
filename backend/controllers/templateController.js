import Template from "../models/Template.js";

// @desc    Add a new website template (Admin only)
// @route   POST /api/templates
// @access  Private (Admin)
export const addTemplate = async (req, res) => {
  console.log("📩 Incoming Body:", req.body);

  try {
    // Destructure fields from request body
    const { title, description, image, demoLink, category } = req.body;

    // Validate required fields
    if (!title || !description || !image || !demoLink) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create template
    const template = await Template.create({
      title,
      description,
      image,
      demoLink,
      category: category || "General", // provide default if missing
    });

    res.status(201).json({
      message: "Template added successfully",
      template,
    });
  } catch (error) {
    console.error("Error adding template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all website templates (Public)
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error" });
  }
};
