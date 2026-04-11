import express from "express";

const router = express.Router();

const feedbackForms = [
  {
    id: 1,
    projectId: 1,
    title: "Playtest Round 1",
    status: "Ongoing",
    responses: 45,
  },
  {
    id: 2,
    projectId: 2,
    title: "Zombie Balance Check",
    status: "Closed",
    responses: 12,
  },
];

router.get("/:projectId", (req, res) => {
  const form = feedbackForms.find(
    (f) => String(f.projectId) === String(req.params.projectId)
  );
  res.json(form || {});
});

router.post("/", (req, res) => {
  const newForm = {
    id: feedbackForms.length + 1,
    status: "Ongoing",
    responses: 0,
    ...req.body,
  };
  res.status(201).json(newForm);
});

export default router;
