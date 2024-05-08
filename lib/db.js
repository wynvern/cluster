const { PrismaClient } = require("@prisma/client");

const prismaClientSingleton = () => {
	return new PrismaClient();
};

if (!global.localPrisma) {
	global.localPrisma = prismaClientSingleton();
}

const prisma = global.localPrisma;

if (process.env.NODE_ENV !== "production") {
	global.localPrisma = prisma;
}

module.exports.db = prisma;
