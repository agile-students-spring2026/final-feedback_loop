import express from "express";

const router = express.Router();

const devLogs = [
  {
    id: 1,
    projectId: 1,
    author: "@margot",
    date: "04/02/2026",
    content: "Fixed the jumping bug in level 3.",
  },
  {
    id: 2,
    projectId: 1,
    author: "@nick",
    date: "04/05/2026",
    content: "Added new enemy AI for the final boss.",
  },
  {
    id: 3,
    projectId: 2,
    author: "@jania",
    date: "04/01/2026",
    content: "Balancing zombie spawn rates.",
  },
];

router.get("/:projectId", (req, res) => {
  const filtered = devLogs.filter(
    (log) => String(log.projectId) === String(req.params.projectId)
  );
  res.json(filtered);
});

router.post("/", (req, res) => {
  const newLog = {
    id: devLogs.length + 1,
    ...req.body,
  };
  res.status(201).json(newLog);
});

export default router;
