import { createBlob } from "@/lib/blob";
import { db } from "@/lib/db";
import { fetchGroupSettings } from "@/lib/db/group/groupManagement";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import { compressImage } from "@/lib/image";
import { NextResponse } from "next/server";

async function getUserIdsFromChat(chatId: string): Promise<string[]> {
	const groupId = await db.groupChat.findUnique({
		where: { id: chatId },
		select: { groupId: true },
	});

	if (!groupId) return [];

	const users = await db.groupMember.findMany({
		where: { groupId: groupId.groupId },
		select: { userId: true },
	});

	return users.map((user) => user.userId);
}

export async function POST(req: Request) {
	const body = await req.json();
	const mediaUrl = [];

	const permission = await memberHasPermission(
		body.userId,
		body.chat.group.groupname,
		"moderator",
	);
	const groupSettings = await fetchGroupSettings({
		groupname: body.chat.group.groupname,
	});

	if (!permission && !groupSettings?.chatEnabled) {
		return NextResponse.json({
			error: "You do not have permission to send messages in this chat",
		});
	}

	const newMessage = await db.message.create({
		data: {
			content: body.content,
			userId: body.userId,
			chatId: body.chatId,
			replyToId: body.replyToId,
		},

		select: {
			id: true,
			content: true,
			media: true,
			createdAt: true,
			chatId: true,
			userId: true,
			chat: {
				select: {
					group: {
						select: {
							groupname: true,
						},
					},
				},
			},
			user: {
				select: {
					id: true,
					username: true,
					image: true,
				},
			},
		},
	});

	if (body.media.length > 0) {
		for (const media of body.media) {
			if (!media) return;
			const buffer = Buffer.from(media, "base64");
			const processedImage = await compressImage(buffer);

			const blob = await createBlob(processedImage, "chat", {
				name: `${newMessage.id}`,
				type: "png",
			});

			mediaUrl.push(blob);
		}

		await db.message.update({
			where: {
				id: newMessage.id,
			},
			data: {
				media: mediaUrl,
			},
		});

		newMessage.media = mediaUrl;
	}

	const groupUsers = await getUserIdsFromChat(body.chatId);

	return NextResponse.json({
		message: newMessage,
		groupUsers,
	});
}

export async function GET(req: Request) {
	return NextResponse.json({ hello: "world" });
}
