import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Connected Failed ❌");
    console.error(error);
    process.exit(1);
  }
}
