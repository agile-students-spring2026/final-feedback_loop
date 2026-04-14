import mongoose from "mongoose";

const feedbackResultSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    submissions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { versionKey: false }
);

export default mongoose.model("FeedbackResult", feedbackResultSchema);
