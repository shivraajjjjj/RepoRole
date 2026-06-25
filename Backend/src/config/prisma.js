import './env.js';
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;
const datasourceUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!datasourceUrl) {
	throw new Error("DATABASE_URL or DIRECT_URL is required to initialize PrismaClient");
}

const adapter = new PrismaPg({
	connectionString: datasourceUrl,
});

export const prisma = globalForPrisma.__prisma__ ?? new PrismaClient({
	adapter,
});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.__prisma__ = prisma;
}

export default prisma;
