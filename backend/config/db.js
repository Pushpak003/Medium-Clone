import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production", // production mein autoIndex off
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Reconnecting...");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
    });
  } catch (err) {
    console.error("❌ DB CONNECTION FAILED:", err.message);
    process.exit(1);
  }
};

export default connectDB;