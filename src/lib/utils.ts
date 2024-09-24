import { clsx, type ClassValue } from "clsx";
import mongoose from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const connectDB = async () => {
  try {
    if (mongoose.connections && mongoose.connections[0].readyState) return;

    const { connection } = await mongoose.connect(
      process.env.MONGO_URL as string,
      {
        dbName: "nextAuth",
      }
    );
    console.log(`Connected to database: ${connection.host}`);
  } catch (error) {
    throw new Error("Error Connecting to database");
  }
};
