import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../p5-data/projects.json");

router.post("/", (req, res) => {
  const { title, description, genre, tags, visibility, uploadType, uploadUrl } =
    req.body;

  fs.readFile(filePath, "utf-8", (err, data) => {
    const projects = data ? JSON.parse(data) : [];

    const newProject = {
      id: projects.length > 0 ? projects[projects.length - 1].id + 1 : 1,
      title,
      description,
      genre,
      tags,
      coverImage: null,
      coverPreview: "",
      uploadType,
      uploadFile: null,
      uploadUrl: uploadUrl || "",
      visibility,
      lastUpdated: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);

    fs.writeFile(filePath, JSON.stringify(projects, null, 2), () => {
      res.status(201).json(newProject);
    });
  });
});

router.put("/:id", (req, res) => {
  const { title, description, genre, tags, visibility, uploadType, uploadUrl } =
    req.body;

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Read error" });

    let projects = JSON.parse(data);
    const index = projects.findIndex(
      (p) => p.id === parseInt(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ error: "Project not found" });
    }

    projects[index] = {
      ...projects[index],
      title,
      description,
      genre,
      tags,
      visibility,
      uploadType,
      uploadUrl: uploadUrl || projects[index].uploadUrl,
      lastUpdated: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
    };

    fs.writeFile(filePath, JSON.stringify(projects, null, 2), () => {
      res.json(projects[index]);
    });
  });
});

export default router;