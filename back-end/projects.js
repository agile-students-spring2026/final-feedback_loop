import express from "express";
import fs from "fs";

const router = express.Router();

// GET all projects
router.get("/", (req, res) => {
  fs.readFile("./projects.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });

    const projects = JSON.parse(data);
    res.json(projects);
  });
});

// GET single project
router.get("/:id", (req, res) => {
  fs.readFile("./projects.json", "utf-8", (err, data) => {
    const projects = JSON.parse(data);
    const project = projects.find(p => p.id == req.params.id);

    res.json(project);
  });
});

// DELETE project
router.delete("/:id", (req, res) => {
  fs.readFile("./projects.json", "utf-8", (err, data) => {
    let projects = JSON.parse(data);

    projects = projects.filter(p => p.id != req.params.id);

    fs.writeFile("./projects.json", JSON.stringify(projects, null, 2), () => {
      res.json({ message: "Deleted successfully" });
    });
  });
});

export default router;