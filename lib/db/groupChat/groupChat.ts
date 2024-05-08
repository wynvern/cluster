"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function fetchMessages(groupId: string) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const messages = await db.message.findMany({
		where: {
			chat: {
				groupId: groupId,
			},
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			chatId: true,
			userId: true,

			user: {
				select: {
					id: true,
					username: true,
					image: true,
				},
			},
		},
	});

	return messages;
}
