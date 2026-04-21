import express from "express";
import Options from "../models/Options.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let options = await Options.findOne().lean();
    if (!options) {
      const created = await Options.create({});
      options = created.toObject();
    }
    const { _id, ...rest } = options;
    res.json(rest);
  } catch (err) {
    res.status(500).json({ error: "Read error" });
  }
});

export default router;
