import { postBlob } from "@/lib/blob";
import { db } from "@/lib/db";
import { compressImage } from "@/lib/image";
import { NextResponse } from "next/server";

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

			const blob = await postBlob(processedImage.toString("base64"), "png");

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

	return NextResponse.json({ ...newMessage });
}

export async function GET(req: Request) {
	return NextResponse.json({ hello: "world" });
}
