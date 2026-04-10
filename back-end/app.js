import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import createProjectRoutes from "./p5-routes/createProject.js";
import createFeedbackFormRoutes from "./p5-routes/createFeedback.js";
import optionsRoutes from "./p5-routes/options.js";

dotenv.config({ silent: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/createprojects", createProjectRoutes);
app.use("/createfeedback", createFeedbackFormRoutes);
app.use("/options", optionsRoutes); 

// mongoose
//   .connect(process.env.DB_CONNECTION_STRING)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error(`Failed to connect to MongoDB: ${err}`));

app.get("/hello", (req, res) => {
  res.json({ message: "server is working" });
});

export default app;