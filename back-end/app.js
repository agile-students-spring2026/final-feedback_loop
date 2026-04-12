import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import createProjectRoutes from "./p5-routes/createProject.js";
import createFeedbackFormRoutes from "./p5-routes/createFeedback.js";
import optionsRoutes from "./p5-routes/options.js";
import { fileURLToPath } from "url";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// file paths
const settingsPath = path.join(__dirname, "settingsData.json");
const projectsPath = path.join(__dirname, "projects.json");
const devlogsPath = path.join(__dirname, "devlogs.json");
const feedbackPath = path.join(__dirname, "feedback.json");
const playtestsPath = path.join(__dirname, "playtests.json");

// mongoose
//   .connect(process.env.DB_CONNECTION_STRING)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error(`Failed to connect to MongoDB: ${err}`));

// middleware
app.use(cors());
app.use(express.json());
app.use("/createprojects", createProjectRoutes);
app.use("/createfeedback", createFeedbackFormRoutes);
app.use("/options", optionsRoutes); 


const readJSON = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
app.use(express.urlencoded({ extended: true }));

app.get("/hello", (req, res) => {
  res.json({ message: "server is working" });
});


app.get("/data/settings", (req, res) => {
  const data = readJSON(settingsPath);
  res.json(data.settings || {});
});

app.post("/data/settings", (req, res) => {
  let data = readJSON(settingsPath);
  data.settings = { ...data.settings, ...req.body };
  writeJSON(settingsPath, data);
  res.json({ success: true });
});


// GET all projects
app.get("/projects", (req, res) => {
  const projects = readJSON(projectsPath);
  res.json(projects);
});

// GET one project
app.get("/projects/:id", (req, res) => {
  const projects = readJSON(projectsPath);
  const project = projects.find(p => p.id == req.params.id);
  res.json(project || {});
});

// DELETE project
app.delete("/projects/:id", (req, res) => {
  let projects = readJSON(projectsPath);
  projects = projects.filter(p => p.id != req.params.id);
  writeJSON(projectsPath, projects);
  res.json({ message: "Deleted successfully" });
});


// GET logs for a project
app.get("/devlogs/:projectId", (req, res) => {
  const logs = readJSON(devlogsPath);
  const filtered = logs.filter(
    log => log.projectId == req.params.projectId
  );
  res.json(filtered);
});

// POST new dev log
app.post("/devlogs", (req, res) => {
  const logs = readJSON(devlogsPath);

  const newLog = {
    id: logs.length + 1,
    ...req.body
  };

  logs.push(newLog);
  writeJSON(devlogsPath, logs);

  res.json(newLog);
});

app.get("/feedback/:projectId", (req, res) => {
  const feedback = readJSON(feedbackPath);

  const result = feedback.filter(
    f => f.projectId == req.params.projectId
  );

  res.json(result);
});

// explore

app.get("/explore/projects", (req, res) => {
  const projects = readJSON(projectsPath);
  const published = projects.filter(p => p.visibility === "published" || p.visibility === "public");
  res.json(published);
});

// get project for projectdetails
app.get("/explore/projects/:id", (req, res) => {
  const projects = readJSON(projectsPath);
  const project = projects.find((p) => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// playtest 
app.get("/playtests", (req, res) => {
  const playtests = readJSON(playtestsPath);
  res.json(playtests);
});

app.post("/playtests", (req, res) => {
  const playtests = readJSON(playtestsPath);
  const { projectId } = req.body;

  if (!projectId) return res.status(400).json({ error: "projectId is required" });

  const already = playtests.find((p) => p.projectId == projectId);
  if (already) return res.status(409).json({ error: "Already joined this playtest" });

  const projects = readJSON(projectsPath);
  const project = projects.find((p) => p.id == projectId);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const entry = {
    id: Date.now(),
    projectId: project.id,
    title: project.title,
    coverPreview: project.coverPreview || "",
    version: "v0.1",
    joined: true,
  };

  playtests.push(entry);
  writeJSON(playtestsPath, playtests);
  res.status(201).json(entry);
});

// delete a playtest
app.delete("/playtests/:projectId", (req, res) => {
  let playtests = readJSON(playtestsPath);
  const before = playtests.length;
  playtests = playtests.filter((p) => p.projectId != req.params.projectId);

  if (playtests.length === before) {
    return res.status(404).json({ error: "Playtest not found" });
  }

  writeJSON(playtestsPath, playtests);
  res.json({ message: "Left playtest successfully" });
});


export default app;

