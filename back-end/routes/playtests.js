import express from "express";

const router = express.Router();

const playtests = [
  {
    id: 101,
    title: "Neon Drift Test Build",
    description: "Early racing prototype",
    version: "v0.1",
    image: "https://picsum.photos/seed/neon/300/200",
  },
  {
    id: 102,
    title: "Puzzle Alpha",
    description: "Logic puzzle system test",
    version: "v0.2",
    image: "https://picsum.photos/seed/puzzlealpha/300/200",
  },
  {
    id: 103,
    title: "Survival Island Build",
    description: "Core survival mechanics",
    version: "v0.3",
    image: "https://picsum.photos/seed/island/300/200",
  },
];

router.get("/", (req, res) => {
  res.json(playtests);
});

router.post("/", (req, res) => {
  const newPlaytest = {
    id: playtests.length + 101,
    ...req.body,
    joined: true,
  };
  res.status(201).json(newPlaytest);
});

export default router;
