import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const formFilePath  = path.join(__dirname, "../p5-data/feedbackform.json");
const summaryFilePath = path.join(__dirname, "../feedback.json");

router.post("/", (req, res) => {
  const { projectId, title, questions } = req.body;

  if (!projectId) return res.status(400).json({ error: "projectId is required" });
  if (!title) return res.status(400).json({ error: "title is required" });

  fs.readFile(formFilePath, "utf-8", (err, formData) => {
    const feedbacks = formData ? JSON.parse(formData) : [];
    const newId = feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) + 1 : 1;

    const newFeedback = {
      id: newId,
      projectId,
      title,
      questions: questions || []
    };

    feedbacks.push(newFeedback);

    fs.writeFile(formFilePath, JSON.stringify(feedbacks, null, 2), () => {

      fs.readFile(summaryFilePath, "utf-8", (err, summaryData) => {
        const summaries = summaryData ? JSON.parse(summaryData) : [];

        const newSummary = {
          id: newId,
          formId: newId,
          projectId,
          title,
          status: "Draft",
          responseCount: 0
        };

        summaries.push(newSummary);

        fs.writeFile(summaryFilePath, JSON.stringify(summaries, null, 2), () => {
          res.status(201).json(newFeedback);
        });
      });
    });
  });
});

router.patch("/:id/status", (req, res) => {
  const { status } = req.body;
  const formId = parseInt(req.params.id);

  fs.readFile(summaryFilePath, "utf-8", (err, data) => {
    const feedbacks = data ? JSON.parse(data) : [];
    const index = feedbacks.findIndex(f => f.id === formId);
    feedbacks[index].status = status;

    fs.writeFile(summaryFilePath, JSON.stringify(feedbacks, null, 2), () => {
      res.json(feedbacks[index]);
    });
  });
});

router.get("/:id", (req, res) => {
  const formId = parseInt(req.params.id);
  fs.readFile(formFilePath, "utf-8", (err, data) => {
    const forms = data ? JSON.parse(data) : [];
    const form = forms.find(f => f.id === formId);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  });
});



export default router;