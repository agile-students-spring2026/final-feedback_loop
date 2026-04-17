import mongoose from "mongoose";

const optionItemSchema = new mongoose.Schema(
  { value: String, label: String },
  { _id: false }
);

const defaultTags = [
  { value: "pixel-art", label: "pixel-art" },
  { value: "adventure", label: "adventure" },
  { value: "2D", label: "2D" },
  { value: "RPG", label: "RPG" },
  { value: "visual-novel", label: "visual-novel" },
  { value: "puzzle", label: "puzzle" },
  { value: "rouguelike", label: "rouguelike" },
  { value: "Horror", label: "Horror" },
];

const defaultGenres = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Card Game", label: "Card Game" },
  { value: "Educational", label: "Educational" },
  { value: "Platformer", label: "Platformer" },
  { value: "Sport", label: "Sport" },
  { value: "Strategy", label: "Strategy" },
];

const optionsSchema = new mongoose.Schema(
  {
    tagOption: { type: [optionItemSchema], default: defaultTags },
    genreOption: { type: [optionItemSchema], default: defaultGenres },
  },
  { versionKey: false }
);

export default mongoose.model("Options", optionsSchema);
