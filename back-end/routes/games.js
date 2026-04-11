import express from "express";

const router = express.Router();

const games = [
  {
    id: 1,
    title: "Pixel Quest",
    description: "Retro puzzle adventure",
    genre: "Adventure",
    version: "v0.1",
    image: "https://picsum.photos/seed/pixel/300/200",
  },
  {
    id: 2,
    title: "Rogue Galaxy",
    description: "Roguelike RPG",
    genre: "RPG",
    version: "v0.2",
    image: "https://picsum.photos/seed/rogue/300/200",
  },
  {
    id: 3,
    title: "Puzzle Mania",
    description: "Brain teasers",
    genre: "Puzzle",
    version: "v0.3",
    image: "https://picsum.photos/seed/mania/300/200",
  },
  {
    id: 4,
    title: "Cyber Drift",
    description: "Neon racing",
    genre: "Racing",
    version: "v0.4",
    image: "https://picsum.photos/seed/cyber/300/200",
  },
  {
    id: 5,
    title: "Mystic Isle",
    description: "Survival mystery",
    genre: "Survival",
    version: "v0.5",
    image: "https://picsum.photos/seed/mystic/300/200",
  },
];

router.get("/", (req, res) => {
  res.json(games);
});

router.get("/:id", (req, res) => {
  const game = games.find((g) => String(g.id) === String(req.params.id));
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
});

export default router;
