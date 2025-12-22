import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully to ",mongoose.connection.name);
    });
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error(error.message);;
  }
};

export default connectDB;
