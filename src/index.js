import "./loadEnv.js";
import { app } from "./app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.on("error", (error) => {
      console.error("Application error occurred:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("MySQL Database connection failed!", error);
    process.exit(1);
  }
}

startServer();
