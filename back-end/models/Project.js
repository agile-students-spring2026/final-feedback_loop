import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    userId: { type: String, default: "" },
    ownerUsername: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    genre: { type: mongoose.Schema.Types.Mixed, default: null },
    tags: { type: [mongoose.Schema.Types.Mixed], default: [] },
    coverImage: { type: mongoose.Schema.Types.Mixed, default: null },
    coverPreview: { type: String, default: "" },
    uploadType: { type: String, default: "" },
    uploadFile: { type: mongoose.Schema.Types.Mixed, default: null },
    uploadUrl: { type: String, default: "" },
    visibility: { type: String, default: "draft" },
    version: { type: String, default: "v0.1" },
    lastUpdated: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false }
);

export default mongoose.model("Project", projectSchema);
