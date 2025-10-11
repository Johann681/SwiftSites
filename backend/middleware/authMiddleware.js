import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Middleware: Protect admin routes
 * Checks for JWT in Authorization header, verifies it, and attaches admin to req
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check for Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authorized — token missing or malformed" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Confirm admin exists
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 5️⃣ Attach admin to request object for downstream use
    req.admin = admin;

    next(); // ✅ Proceed to protected route
  } catch (error) {
    console.error("❌ JWT verification error:", error.message);
    res.status(401).json({ message: "Not authorized — invalid or expired token" });
  }
};
