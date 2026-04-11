import express from "express";

const router = express.Router();

const notifications = [
  {
    id: 1,
    message: "Player #1 started following your project",
    type: "follow",
  },
  {
    id: 2,
    message: "Player #2 submitted feedback on your project",
    type: "feedback",
  },
  {
    id: 3,
    message: "Player #3 started following your project",
    type: "follow",
  },
];

router.get("/", (req, res) => {
  res.json(notifications);
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Notification dismissed", id: req.params.id });
});

export default router;
