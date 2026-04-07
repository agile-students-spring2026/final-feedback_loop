import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/feedback.json");

router.get("/:projectId", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Read error:", err);
      return res.status(500).json({ error: "Failed to read data" });
    }

    let feedback = [];

    try {
      feedback = data ? JSON.parse(data) : [];
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(500).json({ error: "Bad JSON format" });
    }

    const result = feedback.find(
      f => f.projectId == req.params.projectId
    );

    res.json(result || {});
  });
});

export default router;