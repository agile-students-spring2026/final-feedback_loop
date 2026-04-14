import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const Counter = mongoose.model("Counter", counterSchema);

export const nextId = async (name) => {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return doc.seq;
};

export const seedCounter = async (name, currentMax) => {
  await Counter.findByIdAndUpdate(
    name,
    { $max: { seq: currentMax } },
    { upsert: true }
  );
};

export default Counter;
