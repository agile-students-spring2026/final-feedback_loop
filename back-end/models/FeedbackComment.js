import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, default: "Guest" },
    isDev: { type: Boolean, default: false },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const feedbackCommentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    projectId: { type: Number, required: true, index: true },
    player: { type: String, default: "Guest Player" },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: { type: [replySchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("FeedbackComment", feedbackCommentSchema);
