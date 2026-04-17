import mongoose from "mongoose";

const playtestSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    projectId: { type: Number, required: true, index: true },
    title: { type: String, default: "" },
    coverPreview: { type: String, default: "" },
    version: { type: String, default: "v0.1" },
    joined: { type: Boolean, default: true },
  },
  { versionKey: false }
);

export default mongoose.model("Playtest", playtestSchema);
