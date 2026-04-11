import express from "express";

const router = express.Router();

const projects = [
  {
    id: 1,
    name: "Dreamwalker",
    description: "A narrative puzzle game about exploring other peoples dreams.",
    genre: "Adventure",
    tags: ["puzzle", "2D", "visual-novel"],
    status: "PUBLISHED",
    lastUpdated: "03/30/2026",
    coverPreview: "https://picsum.photos/seed/dreamwalker/600/400",
  },
  {
    id: 2,
    name: "Zombie Escape",
    description: "Survive waves of zombies and escape the city.",
    genre: "Survival",
    tags: ["horror", "co-op", "strategy"],
    status: "DRAFT",
    lastUpdated: "03/25/2026",
    coverPreview: "https://picsum.photos/seed/zombie/600/400",
  },
  {
    id: 3,
    name: "Puzzle Quest",
    description: "Solve intricate puzzles to unlock new worlds.",
    genre: "Puzzle",
    tags: ["logic", "singleplayer", "brain"],
    status: "PUBLISHED",
    lastUpdated: "04/05/2026",
    coverPreview: "https://picsum.photos/seed/puzzle/600/400",
  },
];

router.get("/", (req, res) => {
  res.json(projects);
});

router.get("/:id", (req, res) => {
  const project = projects.find((p) => String(p.id) === String(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

router.post("/", (req, res) => {
  const newProject = {
    id: projects.length + 1,
    ...req.body,
    lastUpdated: new Date().toLocaleDateString("en-US"),
  };
  res.status(201).json(newProject);
});

router.put("/:id", (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Project deleted", id: req.params.id });
});

export default router;
