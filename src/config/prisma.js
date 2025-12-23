import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Ensure PrismaClient sees the same DATABASE_URL as migrate
dotenv.config({ path: ".env" });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
});

