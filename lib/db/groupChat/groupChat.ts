"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function fetchMessages(groupId: string, batchIndex: number) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const totalMessages = await db.message.count({
		where: {
			chat: {
				groupId: groupId,
			},
		},
	});

	if (30 * (batchIndex - 1) > totalMessages) {
		return "no-more-messages";
	}

	const skippedMessages = totalMessages - batchIndex * 30;

	const messages = await db.message.findMany({
		where: {
			chat: {
				groupId: groupId,
			},
		},
		skip: skippedMessages < 0 ? 0 : skippedMessages,
		take:
			totalMessages - (batchIndex - 1) * 30
				? 30
				: (totalMessages % 30) + skippedMessages,
		orderBy: {
			createdAt: "asc", // Order by latest messages first
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			chatId: true,
			userId: true,
			media: true,
			attachments: true,
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
