"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { compressImage } from "../image";
import { db } from "../db";
import { createBlob } from "../blob";

export async function uploadCommentMedia(
	id: string,
	media: { base64: string; fileType: string }[],
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const newMediaUrls = [];

	for (const mediaItem of media) {
		const buffer = Buffer.from(mediaItem.base64, "base64");
		const compressedImage = await compressImage(buffer);
		const blobUrl = await createBlob(compressedImage, "comment", {
			type: mediaItem.fileType,
			name: `${session.user.id}-image-${media.indexOf(mediaItem)}.${mediaItem.fileType}`,
		});
		newMediaUrls.push(blobUrl);
	}

	await db.comment.update({
		where: { id, authorId: session.user.id },
		data: { media: newMediaUrls },
	});

	return "ok";
}
