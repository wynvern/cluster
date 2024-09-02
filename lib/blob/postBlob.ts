"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { compressImage } from "../image";
import { db } from "../db";
import { createBlob } from "../blob";

export async function uploadPostMedia(
	id: string,
	media: { base64: string; fileType: string }[]
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const newMediaUrls = [];

	for (const mediaItem of media) {
		const buffer = Buffer.from(mediaItem.base64, "base64");
		const compressedImage = await compressImage(buffer);
		const blobUrl = await createBlob(compressedImage, "post", {
			type: mediaItem.fileType,
			name: `${session.user.id}-image-${media.indexOf(mediaItem)}.${mediaItem.fileType}`,
		});
		newMediaUrls.push(blobUrl);
	}

	await db.post.update({
		where: { id, authorId: session.user.id },
		data: { media: newMediaUrls },
	});

	return "ok";
}

export async function uploadPostDocument(
	id: string,
	files: { base64: string; fileType: string; fileName: string }[]
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	for (const file of files) {
		const buffer = Buffer.from(file.base64, "base64");
		const blobUrl = await createBlob(buffer, "post", {
			type: file.fileType,
			name: `${session.user.id}-file-${files.indexOf(file)}.${file.fileType}`,
		});

		await db.postDocument.create({
			data: {
				postId: id,
				name: file.fileName,
				url: blobUrl,
				type: file.fileType,
			},
		});
	}

	return "ok";
}
