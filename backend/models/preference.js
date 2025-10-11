import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String, // optional but recommended
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("Preference", preferenceSchema);
