import express from "express";

const router = express.Router();

const comments = [
  {
    id: 1,
    player: "Player #1",
    time: "2 hours ago",
    text: "I loved it great game. Level 3 was my favorite",
    likes: 4,
    replies: [
      {
        id: 101,
        name: "Studio 1",
        isDev: true,
        time: "1 hour ago",
        text: "Thanks, fixing it next patch.",
      },
    ],
  },
  {
    id: 2,
    player: "Player #2",
    time: "5 hours ago",
    text: "Really enjoying the art style",
    likes: 7,
    replies: [],
  },
  {
    id: 3,
    player: "Player #3",
    time: "1 day ago",
    text: "Found a physics bug",
    likes: 2,
    replies: [],
  },
];

router.get("/", (req, res) => {
  res.json(comments);
});

router.post("/", (req, res) => {
  const newComment = {
    id: comments.length + 1,
    time: "just now",
    likes: 0,
    replies: [],
    ...req.body,
  };
  res.status(201).json(newComment);
});

router.post("/:id/like", (req, res) => {
  res.json({ id: req.params.id, message: "Liked" });
});

export default router;
