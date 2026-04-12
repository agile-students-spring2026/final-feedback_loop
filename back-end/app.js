import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import gamesRoutes from "./routes/games.js";
import followingRoutes from "./routes/following.js";
import notificationsRoutes from "./routes/notifications.js";
import updatesRoutes from "./routes/updates.js";
import commentsRoutes from "./routes/comments.js";
import reportsRoutes from "./routes/reports.js";

import createProjectRoutes from "./p5-routes/createProject.js";
import createFeedbackFormRoutes from "./p5-routes/createFeedback.js";
import optionsRoutes from "./p5-routes/options.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const settingsPath = path.join(__dirname, "settingsData.json");
const projectsPath = path.join(__dirname, "projects.json");
const devlogsPath = path.join(__dirname, "devlogs.json");
const feedbackPath = path.join(__dirname, "feedback.json");
const playtestsPath = path.join(__dirname, "playtests.json");
const usersPath = path.join(__dirname, "users.json");
const feedbackResultPath = path.join(__dirname, "feedbackResult.json");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/games", gamesRoutes);
app.use("/following", followingRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/updates", updatesRoutes);
app.use("/comments", commentsRoutes);
app.use("/reports", reportsRoutes);

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

app.get("/hello", (req, res) => {
  res.json({ message: "server is working" });
});

app.get("/data/settingsdata", (req, res) => {
  const data = readJSON(settingsPath);
  res.json(data.settings || {});
});

app.post("/data/settingsdata", (req, res) => {
  const { profilePic } = req.body;
  const data = readJSON(settingsPath);
  if (profilePic) data.settings.profilePic = profilePic;
  writeJSON(settingsPath, data);
  res.status(200).json({ message: "Profile pic updated!" });
});

app.get("/data/settings", (req, res) => {
  const userId = parseInt(req.query.userId);
  const users = readJSON(usersPath);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

app.post("/data/settings", (req, res) => {
  const { userId, username, password } = req.body;
  const users = readJSON(usersPath);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });

  if (username) users[userIndex].username = username;
  if (password) users[userIndex].password = password;
  writeJSON(usersPath, users);
  res.status(200).json({ message: "Settings updated!" });
});

app.post("/auth/register", (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(usersPath);
  const user = users.find((person) => person.username === username);

  if (user) {
    return res.status(409).json({
      success: false,
      message: "Username is taken",
    });
  }

  const newUser = { id: Date.now(), username, password };
  users.push(newUser);
  writeJSON(usersPath, users);
  res.status(201).json({
    success: true,
    message: "Registration successful!",
  });
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(usersPath);
  const user = users.find(
    (person) => person.username === username && person.password === password,
  );

  if (user) {
    const { password: pw, ...otherInfo } = user;
    res.json({ success: true, user: otherInfo });
  } else {
    res.status(401).json({ success: false });
  }
});

app.get("/projects", (req, res) => {
  const projects = readJSON(projectsPath);
  res.json(projects);
});

app.get("/projects/:id", (req, res) => {
  const projects = readJSON(projectsPath);
  const project = projects.find((p) => p.id == req.params.id);
  res.json(project || {});
});

app.delete("/projects/:id", (req, res) => {
  let projects = readJSON(projectsPath);
  projects = projects.filter((p) => p.id != req.params.id);
  writeJSON(projectsPath, projects);
  res.json({ message: "Deleted successfully" });
});

app.get("/devlogs/:projectId", (req, res) => {
  const logs = readJSON(devlogsPath);
  const filtered = logs.filter((log) => log.projectId == req.params.projectId);
  res.json(filtered);
});

app.post("/devlogs", (req, res) => {
  const logs = readJSON(devlogsPath);

  const newLog = {
    id: logs.length + 1,
    ...req.body,
  };

  logs.push(newLog);
  writeJSON(devlogsPath, logs);

  res.json(newLog);
});

app.get("/feedback/:projectId", (req, res) => {
  const feedback = readJSON(feedbackPath);
  const result = feedback.filter((f) => f.projectId == req.params.projectId);
  res.json(result);
});

app.get("/feedback-result/:id", (req, res) => {
  const formId = parseInt(req.params.id);

  fs.readFile(feedbackResultPath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read results" });

    const results = data ? JSON.parse(data) : [];
    const result = results.find((r) => r.id === formId);

    if (!result) return res.status(404).json({ error: "Results not found" });
    res.json(result);
  });
});

app.get("/explore/projects", (req, res) => {
  const projects = readJSON(projectsPath);
  const published = projects.filter(
    (p) => p.visibility === "published" || p.visibility === "public",
  );
  res.json(published);
});

app.get("/explore/projects/:id", (req, res) => {
  const projects = readJSON(projectsPath);
  const project = projects.find((p) => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.get("/playtests", (req, res) => {
  const playtests = readJSON(playtestsPath);
  res.json(playtests);
});

app.post("/playtests", (req, res) => {
  const playtests = readJSON(playtestsPath);
  const { projectId } = req.body;

  if (!projectId)
    return res.status(400).json({ error: "projectId is required" });

  const already = playtests.find((p) => p.projectId == projectId);
  if (already)
    return res.status(409).json({ error: "Already joined this playtest" });

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
export { readJSON, writeJSON };
