import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true, index: true },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dpdidryxs/image/upload/v1776738351/blank-pfp_yk8bl5.png",
    },
  },
  { versionKey: false }
);

export default mongoose.model("Settings", settingsSchema);
