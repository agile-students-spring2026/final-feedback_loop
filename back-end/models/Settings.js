import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true, index: true },
    profilePic: { type: String, default: "https://picsum.photos/200" },
  },
  { versionKey: false }
);

export default mongoose.model("Settings", settingsSchema);
