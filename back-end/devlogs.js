import express from "express";
import fs from "fs";

const router = express.Router();
const filePath = "./devlogs.json";

// GET dev logs for a project (optional for later)
router.get("/:projectId", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Read error" });

    const logs = JSON.parse(data);
    const filtered = logs.filter(
      log => log.projectId == req.params.projectId
    );

    res.json(filtered);
  });
});

// POST new dev log
router.post("/", (req, res) => {
  const { projectId, teamMember, date, notes } = req.body;

  fs.readFile(filePath, "utf-8", (err, data) => {
    const logs = data ? JSON.parse(data) : [];

    const newLog = {
      id: logs.length + 1,
      projectId,
      teamMember,
      date,
      notes
    };

    logs.push(newLog);

    fs.writeFile(filePath, JSON.stringify(logs, null, 2), () => {
      res.json(newLog);
    });
  });
});

export default router;