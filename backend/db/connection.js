import mongoose from "mongoose";
import "dotenv/config";

const connection = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });

     console.log("✅ DB CONNECTED SUCCESSFULLY");
  } catch (err) {
    console.log(err);
  }
};

export default connection;
