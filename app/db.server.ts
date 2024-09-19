import { PrismaClient } from "@prisma/client";
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carga las variables de entorno
config({ path: resolve(__dirname, '../.env') });

console.log('DATABASE_URL in db.server.ts:', process.env.DATABASE_URL);

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

console.log("Initializing database connection");
if (process.env.NODE_ENV === "production") {
  console.log("Production mode: Creating new PrismaClient");
  db = new PrismaClient();
} else {
  if (!global.__db) {
    console.log("Development mode: Creating new PrismaClient");
    global.__db = new PrismaClient();
  } else {
    console.log("Development mode: Reusing existing PrismaClient");
  }
  db = global.__db;
}

try {
  console.log("Attempting to connect to the database");
  db.$connect();
  console.log("Database connected successfully");
  console.log("Available models:", Object.keys(db));
} catch (error) {
  console.error("Failed to connect to the database:", error);
}

export { db };