import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Template title is required"] },
    description: { type: String, required: [true, "Template description is required"] },
    image: { type: String, required: [true, "Template image is required"] },
    demoLink: { type: String, required: [true, "Demo link is required"] },
    category: { type: String, default: "General" }, // new field
  },
  { timestamps: true }
);

export default mongoose.model("Template", templateSchema);
