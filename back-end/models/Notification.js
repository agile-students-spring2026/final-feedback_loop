import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },

    recipientId: { type: String, required: true, index: true },
    senderId: { type: String },

    projectId: { type: Number },
    devlogId: { type: Number },

    type: {
      type: String,
      enum: ["devlog", "feedback", "follow"],
      required: true,
    },

    message: { type: String, default: "" },
    read: { type: Boolean, default: false },

    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false }
);

export default mongoose.model("Notification", notificationSchema);