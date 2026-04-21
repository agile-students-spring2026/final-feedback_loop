import mongoose from "mongoose";

const feedbackFormSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    projectId: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true },
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { versionKey: false }
);

export default mongoose.model("FeedbackForm", feedbackFormSchema);
