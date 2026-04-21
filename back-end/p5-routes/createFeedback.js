import express from "express";
import FeedbackForm from "../models/FeedbackForm.js";
import FeedbackSummary from "../models/FeedbackSummary.js";
import FeedbackResult from "../models/FeedbackResult.js";
import Project from "../models/Project.js";
import { nextId } from "../models/Counter.js";
import { requireAuth } from "../auth.js";
import { strip } from "../utils.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { projectId, title, questions } = req.body;

  if (!projectId)
    return res.status(400).json({ error: "projectId is required" });
  if (!title) return res.status(400).json({ error: "title is required" });

  const project = await Project.findOne({ id: Number(projectId) }).lean();
  if (!project) return res.status(404).json({ error: "Project not found" });
  if (String(project.userId) !== String(req.user.userId))
    return res.status(403).json({ error: "Not your project" });

  const newId = await nextId("feedbackForm");

  const newFeedback = {
    id: newId,
    projectId,
    title,
    questions: questions || [],
  };

  await FeedbackForm.create(newFeedback);
  await FeedbackSummary.create({
    id: newId,
    formId: newId,
    projectId,
    title,
    status: "Draft",
    responseCount: 0,
  });
  await FeedbackResult.create({ id: newId, submissions: [] });

  res.status(201).json(newFeedback);
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;
  const formId = parseInt(req.params.id);

  const summary = await FeedbackSummary.findOne({ id: formId }).lean();
  if (!summary) return res.status(404).json({ error: "Summary not found" });

  const project = await Project.findOne({ id: summary.projectId }).lean();
  if (!project || String(project.userId) !== String(req.user.userId))
    return res.status(403).json({ error: "Not your project" });

  const result = await FeedbackSummary.findOneAndUpdate(
    { id: formId },
    { status },
    { returnDocument: "after", lean: true }
  );
  res.json(strip(result));
});

router.get("/:id", async (req, res) => {
  const formId = parseInt(req.params.id);
  const form = await FeedbackForm.findOne({ id: formId }).lean();
  if (!form) return res.status(404).json({ error: "Form not found" });
  res.json(strip(form));
});

export default router;
