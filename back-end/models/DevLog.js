import mongoose from "mongoose";

const devLogSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    projectId: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
    teamMember: { type: String, default: "" },
    date: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { versionKey: false }
);

export default mongoose.model("DevLog", devLogSchema);
