import express from "express";

const router = express.Router();

const projectUpdates = [
  {
    id: 1,
    title: "Project Alpha",
    developer: "Studio 1",
    image: "https://picsum.photos/seed/alpha/300/200",
    time: "Updated at 2:30 PM",
    description: "Added level 4. Fixed a bug.",
  },
  {
    id: 2,
    title: "Project Beta",
    developer: "Studio 2",
    image: "https://picsum.photos/seed/beta/300/200",
    time: "Updated at 11:00 AM",
    description: "Changed enemy spawns. Added new weapons.",
  },
];

router.get("/", (req, res) => {
  res.json(projectUpdates);
});

export default router;
