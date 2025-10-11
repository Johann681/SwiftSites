import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import userRegisterRoute from "./routes/userRegisterRoute.js";
import userLoginRoute from "./routes/userLoginRoute.js";
import preferenceRoute from "./routes/preferenceRoute.js";
import aiRoutes from "./routes/ai.js";


dotenv.config();

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/users", userRegisterRoute);
app.use("/api/users", userLoginRoute);
app.use("/api/preferences", preferenceRoute);
app.use("/api", aiRoutes); // AI route

app.get("/", (req, res) => {
  res.send("🚀 SwiftSites Backend is Live!");
});

// ⚙️ Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

startServer();
