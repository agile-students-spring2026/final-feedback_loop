import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../p5-data/feedbackform.json");

router.post("/", (req, res) => {
  const { projectId, title, questions } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "projectId is required" });
  }
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    const feedbacks = data ? JSON.parse(data) : [];

    const newFeedback = {
      id: feedbacks.length > 0 ? feedbacks[feedbacks.length - 1].id + 1 : 1,
      projectId,
      title,
      questions: questions || []
    };

    feedbacks.push(newFeedback);

    fs.writeFile(filePath, JSON.stringify(feedbacks, null, 2), () => {
      res.status(201).json(newFeedback);
    });
  });
});

export default router;