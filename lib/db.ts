import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	var localPrisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.localPrisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.localPrisma = prisma;

export const db = prisma;
