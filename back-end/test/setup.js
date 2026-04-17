import dotenv from "dotenv";
dotenv.config({ silent: true });

if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "test-secret";

import mongoose from "mongoose";
import { signToken } from "../auth.js";

const baseUri =
  process.env.DB_CONNECTION_STRING ||
  "mongodb://localhost:27017/feedback_loop";

const testUri = baseUri.replace(
  /\/(feedback_loop)(\?|$)/,
  "/feedback_loop_test$2"
);

export const testToken = () =>
  signToken({ userId: 9999, username: "tester" });

export const authHeader = () => ({ Authorization: `Bearer ${testToken()}` });

before(async function () {
  this.timeout(30000);
  await mongoose.connect(testUri);
});

after(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) await c.deleteMany({});
  await mongoose.disconnect();
});
