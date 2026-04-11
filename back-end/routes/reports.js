import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const newReport = {
    id: Date.now(),
    status: "received",
    ...req.body,
  };
  res.status(201).json(newReport);
});

export default router;
