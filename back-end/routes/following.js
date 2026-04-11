import express from "express";

const router = express.Router();

const followedGames = [
  {
    id: 1,
    title: "Project Alpha",
    developer: "Studio 1",
    image: "https://picsum.photos/seed/alpha/300/200",
    isNew: true,
    description: "Puzzle game. New level added.",
    time: "2 hours ago",
    following: true,
  },
  {
    id: 2,
    title: "Project Beta",
    developer: "Studio 2",
    image: "https://picsum.photos/seed/beta/300/200",
    isNew: true,
    description: "Dungeon crawler. Kill stuff and get loot.",
    time: "5 hours ago",
    following: true,
  },
  {
    id: 3,
    title: "Project Gamma",
    developer: "Studio 3",
    image: "https://picsum.photos/seed/gamma/300/200",
    isNew: false,
    description: "Platformer. Still in early alpha.",
    time: "1 day ago",
    following: true,
  },
  {
    id: 4,
    title: "Project Delta",
    developer: "Studio 4",
    image: "https://picsum.photos/seed/delta/300/200",
    isNew: false,
    description: "PvP action game.",
    time: "3 days ago",
    following: true,
  },
];

router.get("/", (req, res) => {
  res.json(followedGames);
});

router.put("/:id", (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

export default router;
