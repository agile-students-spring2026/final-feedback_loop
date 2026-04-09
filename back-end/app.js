import express from "express";
import projectsRoutes from "./projects.js";
import devlogRoutes from "./devlogs.js";
import feedbackRoutes from "./feedback.js";
import cors from "cors";


const app = express();

export default app;

app.use(express.json());
app.use(cors());

app.use("/projects", projectsRoutes);
app.use("/devlogs", devlogRoutes);
app.use("/feedback", feedbackRoutes);
