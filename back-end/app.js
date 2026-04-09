import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ silent: true });

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hardPath = path.join(__dirname, "settingsData.json");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(`Failed to connect to MongoDB: ${err}`));

const readData = () => {
  if (!fs.existsSync(hardPath)) {
    return { users: [], settings: [] };
  }
  return JSON.parse(fs.readFileSync(hardPath, "utf8"));
};

const writeData = (data) => {
  fs.writeFileSync(hardPath, JSON.stringify(data, null, 2));
};

app.get("/hello", (req, res) => {
  res.json({ message: "server is working" });
});

app.get("/data/settings", (req, res) => {
  const data = readData();
  res.json(data.settings || {});
});

app.post("/data/settings", (req, res) => {
  const data = readData();
  data.settings = { ...data.settings, ...req.body };
  writeData(data);
  res.json({ success: true, message: "Saved to JSON" });
});

export default app;
