import mongoose from "mongoose";

const feedbackSummarySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    formId: { type: Number, required: true, index: true },
    projectId: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true },
    status: { type: String, default: "Draft" },
    responseCount: { type: Number, default: 0 },
  },
  { versionKey: false }
);

export default mongoose.model("FeedbackSummary", feedbackSummarySchema);
