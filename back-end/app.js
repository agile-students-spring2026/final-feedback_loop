import express from "express";
import cors from "cors";

import createProjectRoutes from "./p5-routes/createProject.js";
import createFeedbackFormRoutes from "./p5-routes/createFeedback.js";
import optionsRoutes from "./p5-routes/options.js";

import User from "./models/User.js";
import Project from "./models/Project.js";
import DevLog from "./models/DevLog.js";
import FeedbackForm from "./models/FeedbackForm.js";
import FeedbackSummary from "./models/FeedbackSummary.js";
import FeedbackResult from "./models/FeedbackResult.js";
import Settings from "./models/Settings.js";
import FeedbackComment from "./models/FeedbackComment.js";
import Notification from "./models/Notification.js";

import { nextId } from "./models/Counter.js";
import { strip } from "./utils.js";
import {
  hashPassword,
  comparePassword,
  signToken,
  requireAuth,
} from "./auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/createprojects", createProjectRoutes);
app.use("/createfeedback", createFeedbackFormRoutes);
app.use("/options", optionsRoutes);

app.get("/hello", (req, res) => {
  res.json({ message: "server is working" });
});

app.get("/data/settings", requireAuth, async (req, res) => {
  const user = await User.findOne({ id: req.user.userId }).lean();

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    username: user.username,
    profilePic:
      user.profilePic ||
      "https://res.cloudinary.com/dpdidryxs/image/upload/v1776738351/blank-pfp_yk8bl5.png",
  });
});

app.post("/data/settings", requireAuth, async (req, res) => {
  const { profilePic, username, password } = req.body;
  const updateData = {};

  if (profilePic) updateData.profilePic = profilePic;
  if (username) updateData.username = username;
  if (password) updateData.password = await hashPassword(password);

  await User.updateOne({ id: req.user.userId }, { $set: updateData });
  res.status(200).json({ message: "Settings updated!" });
});

app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "missing fields" });
  }
  const existing = await User.findOne({ username });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Username is taken" });
  }
  const userId = Date.now();
  const hashed = await hashPassword(password);
  await User.create({
    id: userId,
    username,
    password: hashed,
  });
  const publicUser = { id: userId, username };
  const token = signToken({ userId, username });
  res.status(201).json({
    success: true,
    message: "Registration successful!",
    user: publicUser,
    token,
  });
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false });
  }
  const user = await User.findOne({ username }).lean();
  if (!user) return res.status(401).json({ success: false });
  const ok = await comparePassword(password, user.password);
  if (!ok) return res.status(401).json({ success: false });
  const { password: _, _id, ...otherInfo } = user;
  const token = signToken({ userId: user.id, username: user.username });
  res.json({ success: true, user: otherInfo, token });
});

app.delete("/auth/users/:id", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.id);
  if (userId !== req.user.userId)
    return res
      .status(403)
      .json({ message: "Can only delete your own account" });
  const result = await User.deleteOne({ id: userId });
  if (result.deletedCount === 0)
    return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User deleted" });
});

app.get("/projects", requireAuth, async (req, res) => {
  const projects = await Project.find({
    userId: String(req.user.userId),
  }).lean();
  res.json(strip(projects));
});

app.get("/projects/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "bad id" });
  const project = await Project.findOne({ id }).lean();
  res.json(project ? strip(project) : {});
});

app.delete("/projects/:id", requireAuth, async (req, res) => {
  const projectId = Number(req.params.id);
  if (!Number.isFinite(projectId))
    return res.status(400).json({ error: "bad id" });

  const existing = await Project.findOne({ id: projectId }).lean();
  if (!existing) return res.status(404).json({ error: "Project not found" });
  if (String(existing.userId) !== String(req.user.userId))
    return res.status(403).json({ error: "not your project" });

  await Promise.all([
    Project.deleteOne({ id: projectId }),
    DevLog.deleteMany({ projectId }),
    FeedbackSummary.deleteMany({ projectId }),
    FeedbackForm.deleteMany({ projectId }),
    FeedbackComment.deleteMany({ projectId }),
  ]);

  const orphanForms = await FeedbackForm.find({ projectId }).distinct("id");
  if (orphanForms.length) {
    await FeedbackResult.deleteMany({ id: { $in: orphanForms } });
  }

  res.json({ message: "Project and related data deleted successfully" });
});

app.get("/devlogs/:projectId", async (req, res) => {
  const raw = req.params.projectId;
  const asNum = Number(raw);
  const query = Number.isNaN(asNum)
    ? { projectId: raw }
    : { $or: [{ projectId: asNum }, { projectId: raw }] };
  const logs = await DevLog.find(query).lean();
  res.json(strip(logs));
});

app.get("/feedback-result/:id", async (req, res) => {
  const formId = parseInt(req.params.id);
  const result = await FeedbackResult.findOne({ id: formId }).lean();
  if (!result) return res.status(404).json({ error: "Results not found" });
  res.json(strip(result));
});

app.post("/feedback-result/:formId", requireAuth, async (req, res) => {
  const formId = Number(req.params.formId);
  if (!Number.isFinite(formId))
    return res.status(400).json({ error: "Invalid formId" });

  const { answers } = req.body;
  if (!answers || typeof answers !== "object")
    return res.status(400).json({ error: "answers object required" });

  const summary = await FeedbackSummary.findOne({ formId }).lean();
  if (!summary) return res.status(404).json({ error: "Form not found" });
  if (summary.status !== "Active")
    return res.status(400).json({ error: "Form is not accepting submissions" });

  const submission = {
    username: req.user.username || "Player",
    date: new Date().toISOString(),
    answers,
  };

  await FeedbackResult.updateOne(
    { id: formId },
    { $push: { submissions: submission }, $setOnInsert: { id: formId } },
    { upsert: true }
  );
  await FeedbackSummary.updateOne({ formId }, { $inc: { responseCount: 1 } });

  const form = await FeedbackSummary.findOne({ formId }).lean();

  if (form) {
    const project = await Project.findOne({ id: form.projectId }).lean();

    if (project && String(project.userId) !== String(req.user.userId)) {
      const user = await User.findOne({ id: req.user.userId }).lean();

      await Notification.create({
        id: Date.now() + Math.random(),
        recipientId: String(project.userId),
        senderId: String(req.user.userId),
        projectId: project.id,
        type: "feedback",
        message: `${user.username} submitted feedback on ${project.title}`,
      });
    }
  }
  res.status(201).json({ success: true });
});

app.post("/devlogs", requireAuth, async (req, res) => {
  const projectId = Number(req.body.projectId);
  if (!Number.isFinite(projectId))
    return res.status(400).json({ error: "projectId is required" });

  const project = await Project.findOne({ id: projectId }).lean();
  if (!project) return res.status(404).json({ error: "Project not found" });

  if (String(project.userId) !== String(req.user.userId))
    return res.status(403).json({ error: "Not your project" });

  const id = await nextId("devlog");
  const newLog = { id, ...req.body, projectId };
  await DevLog.create(newLog);

  const followers = await Playtest.find({ projectId }).lean();

  for (const f of followers) {
    if (String(f.userId) === String(req.user.userId)) continue;

    await Notification.create({
      id: Date.now() + Math.random(),
      recipientId: String(f.userId),
      senderId: String(req.user.userId),
      projectId,
      devlogId: id,
      type: "devlog",
      message: `${project.title} posted a new devlog`,
    });
  }

  res.json(newLog);
});

app.get("/feedback/:projectId", async (req, res) => {
  const raw = req.params.projectId;
  const asNum = Number(raw);
  const query = Number.isNaN(asNum)
    ? { projectId: raw }
    : { $or: [{ projectId: asNum }, { projectId: raw }] };
  const summaries = await FeedbackSummary.find(query).lean();
  res.json(strip(summaries));
});

app.get("/explore/projects", async (req, res) => {
  const projects = await Project.find({
    visibility: { $in: ["published", "public"] },
  }).lean();
  res.json(strip(projects));
});

app.get("/explore/projects/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id))
    return res.status(400).json({ error: "Invalid project id" });
  const project = await Project.findOne({ id }).lean();
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(strip(project));
});

app.get("/feedback-comments/:projectId", async (req, res) => {
  const projectId = Number(req.params.projectId);
  if (Number.isNaN(projectId))
    return res.status(400).json({ error: "Invalid projectId" });
  const comments = await FeedbackComment.find({ projectId })
    .sort({ createdAt: -1 })
    .lean();
  res.json(strip(comments));
});

app.post("/feedback-comments", requireAuth, async (req, res) => {
  const { projectId, text } = req.body;

  if (!projectId || !text)
    return res.status(400).json({ error: "projectId and text are required" });

  const user = await User.findOne({ id: req.user.userId }).lean();

  const comment = await FeedbackComment.create({
    id: await nextId("feedbackComment"),
    projectId: Number(projectId),
    player: user?.username || "Player",
    text,
    likes: 0,
    replies: [],
  });

  const project = await Project.findOne({ id: Number(projectId) }).lean();

  if (project && String(project.userId) !== String(req.user.userId)) {
    await Notification.create({
      id: Date.now() + Math.random(),
      recipientId: String(project.userId),
      senderId: String(req.user.userId),
      projectId: Number(projectId),
      type: "feedback",
      message: `${user.username} commented on ${project.title}`,
    });
  }

  res.status(201).json(strip(comment.toObject()));
});

app.post("/feedback-comments/:id/like", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const username = req.user.username;

  const comment = await FeedbackComment.findOne({ id }).lean();
  if (!comment) return res.status(404).json({ error: "Comment not found" });

  if (comment.likedBy?.includes(username)) {
    return res.status(409).json({ error: "Already liked" });
  }

  const updated = await FeedbackComment.findOneAndUpdate(
    { id },
    { $inc: { likes: 1 }, $addToSet: { likedBy: username } },
    { returnDocument: "after", lean: true }
  );

  res.json(strip(updated));
});

app.post("/feedback-comments/:id/reply", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { isDev, text } = req.body;

  if (!text) return res.status(400).json({ error: "text is required" });

  const user = await User.findOne({ id: req.user.userId }).lean();

  const reply = {
    id: await nextId("feedbackReply"),
    name: user?.username || "User",
    isDev: Boolean(isDev),
    text,
    createdAt: new Date(),
  };

  const updated = await FeedbackComment.findOneAndUpdate(
    { id },
    { $push: { replies: reply } },
    { returnDocument: "after", lean: true }
  );

  if (!updated) return res.status(404).json({ error: "Comment not found" });

  try {
    const project = await Project.findOne({ id: updated.projectId }).lean();

    if (updated.player && updated.player !== user?.username) {
      const originalUser = await User.findOne({
        username: updated.player,
      }).lean();

      if (originalUser) {
        await Notification.create({
          id: Date.now() + Math.random(),
          recipientId: String(originalUser.id),
          senderId: String(req.user.userId),
          projectId: updated.projectId,
          type: "feedback",
          message: `${user?.username || "Someone"} replied to your comment`,
        });
      }
    }

    if (project && String(project.userId) !== String(req.user.userId)) {
      await Notification.create({
        id: Date.now() + Math.random(),
        recipientId: String(project.userId),
        senderId: String(req.user.userId),
        projectId: updated.projectId,
        type: "feedback",
        message: `${user?.username || "Someone"} replied in your game's comments`,
      });
    }
  } catch (err) {
    console.error("Notification error (reply):", err);
  }

  res.json(strip(updated));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.get("/notifications", requireAuth, async (req, res) => {
  const notifications = await Notification.find({
    recipientId: String(req.user.userId),
  })
    .sort({ createdAt: -1 })
    .lean();

  res.json(strip(notifications));
});

app.patch("/notifications/:id/read", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await Notification.updateOne({ id }, { read: true });

  res.json({ message: "Marked as read" });
});

app.delete("/notifications/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await Notification.deleteOne({ id });

  res.json({ message: "Deleted" });
});

export default app;
