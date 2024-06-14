"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function fetchUserChats() {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const groups = await db.groupMember.findMany({
		where: { userId: session.user.id },
		select: {
			group: {
				select: {
					id: true,
					name: true,
					groupname: true,
					image: true,
					GroupChat: {
						select: {
							id: true,
							messages: {
								orderBy: { createdAt: "desc" },
								take: 1,
								select: {
									content: true,
									user: {
										select: {
											username: true,
										},
									},
									createdAt: true,
								},
							},
						},
					},
				},
			},
		},
	});

	return groups.map((group) => group.group);
}

export async function createMessage(message: string, groupChatId: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const groupMember = await db.groupMember.findFirst({
		where: { userId: session.user.id },
	});

	if (!groupMember) return "not-member";

	await db.message.create({
		data: {
			content: message,
			userId: session.user.id,
			chatId: groupChatId,
		},
	});

	return "ok";
}

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
