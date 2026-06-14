import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  connectCloudinary();

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

startServer();