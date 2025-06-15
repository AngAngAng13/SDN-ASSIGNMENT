import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("🔴 MONGO_URI is not defined in the .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    logger.info("🟢 MongoDB Hello World");
  } catch (error) {
    logger.info("🔴 MongoDB No world to hello to:", error);
    process.exit(1);
  }
};

export default connectDB;