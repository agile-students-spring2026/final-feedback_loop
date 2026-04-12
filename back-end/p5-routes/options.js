import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
 
const router = express.Router();
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../p5-data/options.json");
 
router.get("/", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Read error" });
    const options = JSON.parse(data);
    res.json(options);
  });
});
 
export default router;