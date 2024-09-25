"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { memberHasPermission } from "./groupUtils";
import type { MessageProps } from "./type";

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

export async function deleteMessage(messageId: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const message = await db.message.findFirst({
		where: {
			id: messageId,
		},
		include: {
			chat: {
				select: {
					group: {
						select: {
							groupname: true,
						},
					},
				},
			},
		},
	});

	const groupPermission = await memberHasPermission(
		session.user.id,
		message?.chat.group.groupname || "",
		"moderator"
	);

	if (!groupPermission && message?.userId !== session.user.id) {
		return "no-permission";
	}

	if (!message) return "not-found";

	await db.message.delete({
		where: {
			id: messageId,
		},
	});

	return "ok";
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

export async function fetchMessages(
	groupId: string,
	loadedMessagesCount: number
): Promise<MessageProps[] | string> {
	const session = await getServerSession(authOptions);
	const batchSize = Number.parseInt(
		process.env.NEXT_PUBLIC_BATCH_FETCH_SIZE || "40"
	);
	if (!session) return "no-session";

	const totalMessages = await db.message.count({
		where: {
			chat: {
				groupId: groupId,
			},
		},
	});

	if (loadedMessagesCount >= totalMessages) {
		return "no-more-messages";
	}

	const skippedMessages = Math.max(
		totalMessages - loadedMessagesCount - batchSize,
		0
	);
	const takeAmount = Math.min(batchSize, totalMessages - loadedMessagesCount);

	const messages = await db.message.findMany({
		where: {
			chat: {
				groupId: groupId,
			},
		},
		skip: skippedMessages,
		take: takeAmount,
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
			replyToId: true,
			user: {
				select: {
					id: true,
					username: true,
					image: true,
				},
			},
			chat: {
				select: {
					group: {
						select: {
							groupname: true,
						},
					},
				},
			},
		},
	});

	return messages;
}
