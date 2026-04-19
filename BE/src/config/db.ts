import { prisma } from "../lib/prisma";

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("MongoDB connected via Prisma");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};