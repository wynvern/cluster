import { postBlob } from "@/lib/blob";
import { db } from "@/lib/db";
import { compressImage } from "@/lib/image";
import { NextResponse } from "next/server";

async function getUserIdsFromChat(chatId: string): Promise<string[]> {
	const groupId = await db.groupChat.findUnique({
		where: { id: chatId },
		select: { groupId: true },
	});

	if (!groupId) return [];
	console.log(groupId, "groupId");
	const users = await db.groupMember.findMany({
		where: { groupId: groupId.groupId },
		select: { userId: true },
	});

	return users.map((user) => user.userId);
}

export async function POST(req: Request) {
	const body = await req.json();
	const mediaUrl = [];

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

	console.log(body.media);

	if (body.media.length > 0) {
		for (const media of body.media) {
			if (!media) return;
			const buffer = Buffer.from(media, "base64");
			const processedImage = await compressImage(buffer);

			const blob = await postBlob(
				processedImage.toString("base64"),
				"png"
			);

			console.log(blob.urlToMedia);
			mediaUrl.push(blob.urlToMedia);
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
	console.log(groupUsers, "groupUsers");

	return NextResponse.json({
		message: newMessage,
		groupUsers,
	});
}

export async function GET(req: Request) {
	return NextResponse.json({ hello: "world" });
}
