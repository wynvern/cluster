import { db } from "@/lib/db";
import type { User } from "@prisma/client";

type UserId = { id: string; username?: string };
type UserName = { id?: string; username: string };

export default async function fetchUser(
	params: UserId | UserName
): Promise<User | null> {
	const query = await db.user.findUnique({ where: params });

	if (!query) return null;

	return query;
}
