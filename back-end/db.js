import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.DB_CONNECTION_STRING;
  if (!uri) throw new Error("DB_CONNECTION_STRING is not set");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
