import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// file paths
const settingsPath = path.join(__dirname, "settingsData.json");
const projectsPath = path.join(__dirname, "projects.json");
const devlogsPath = path.join(__dirname, "devlogs.json");
const feedbackPath = path.join(__dirname, "feedback.json");

// middleware
app.use(cors());
app.use(express.json());

/* ---------------- HELPER FUNCTIONS ---------------- */

const readJSON = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

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

  const result = feedback.find(
    f => f.projectId == req.params.projectId
  );

  res.json(result || {});
});

export default app;

