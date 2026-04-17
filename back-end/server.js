import dotenv from "dotenv";
dotenv.config({ silent: true });

import app from "./app.js";
import { connectDB, disconnectDB } from "./db.js";
import Project from "./models/Project.js";
import DevLog from "./models/DevLog.js";
import FeedbackForm from "./models/FeedbackForm.js";
import FeedbackComment from "./models/FeedbackComment.js";
import { seedCounter } from "./models/Counter.js";

const PORT = process.env.PORT || 7002;

let listener;

const syncCounters = async () => {
  const pairs = [
    ["project", Project],
    ["devlog", DevLog],
    ["feedbackForm", FeedbackForm],
    ["feedbackComment", FeedbackComment],
  ];
  for (const [name, Model] of pairs) {
    const doc = await Model.findOne().sort({ id: -1 }).lean();
    const max = doc?.id || 0;
    await seedCounter(name, max);
  }
};

const start = async () => {
  await connectDB();
  await syncCounters();
  listener = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export const close = async () => {
  if (listener) listener.close();
  await disconnectDB();
};
