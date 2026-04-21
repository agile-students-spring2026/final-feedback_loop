import express from "express";
import Project from "../models/Project.js";
import { nextId } from "../models/Counter.js";
import { requireAuth } from "../auth.js";
import Options from "../models/Options.js";

const router = express.Router();

const syncOptions = async (genre, tags) => {
  let options = await Options.findOne();
  if (!options) options = await Options.create({});

  const genreList = options.genreOption;
  const tagList = options.tagOption;

  if (genre && !genreList.some((g) => g.value === genre.value)) {
    genreList.push(genre);
  }

  if (tags) {
    for (const tag of tags) {
      if (!tagList.some((t) => t.value === tag.value)) {
        tagList.push(tag);
      }
    }
  }

  await Options.updateOne({}, { genreOption: genreList, tagOption: tagList });
};

const formattedDate = () =>
  new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

router.post("/", requireAuth, async (req, res) => {
  const { title, description, genre, tags, visibility, uploadType, uploadUrl, version } =
    req.body;

  const newId = await nextId("project");

  const newProject = {
    id: newId,
    userId: String(req.user.userId),
    ownerUsername: req.user.username || "",
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
    version: version || "v0.1",
    lastUpdated: formattedDate(),
    createdAt: new Date().toISOString(),
  };

  await Project.create(newProject);
  await syncOptions(genre, tags);
  res.status(201).json(newProject);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, genre, tags, visibility, uploadType, uploadUrl, version } =
    req.body;
  const id = parseInt(req.params.id);

  const existing = await Project.findOne({ id }).lean();
  if (!existing) return res.status(404).json({ error: "Project not found" });
  if (String(existing.userId) !== String(req.user.userId))
    return res.status(403).json({ error: "Not your project" });

  const update = {
    title,
    description,
    genre,
    tags,
    visibility,
    uploadType,
    uploadUrl: uploadUrl || existing.uploadUrl,
    version: version || existing.version || "v0.1",
    lastUpdated: formattedDate(),
  };

  await Project.updateOne({ id }, update);
  await syncOptions(genre, tags);
  const updated = await Project.findOne({ id }, { _id: 0 }).lean();
  res.json(updated);
});

export default router;
