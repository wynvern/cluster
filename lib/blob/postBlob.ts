"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { compressImage, squareImage } from "../image";
import { db } from "../db";
import { postBlob } from "../blob";

interface fileNameBase64 {
	base64: string;
	name: string;
}

export async function uploadPostMedia(id: string, media: string[]) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const newMediaUrls = [];

	for (const mediaItem of media) {
		const buffer = Buffer.from(mediaItem, "base64");
		const processedImage = await compressImage(buffer);

		const blob = await postBlob(processedImage.toString("base64"), "png");

		newMediaUrls.push(blob.urlToMedia);
	}

	await db.post.update({
		where: { id, authorId: session.user.id },
		data: { media: newMediaUrls },
	});

	return "ok";
}

export async function uploadPostDocument(id: string, files: fileNameBase64[]) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";
	const documentUrls = [];

	for (const file of files) {
		const buffer = Buffer.from(file.base64, "base64");
		const blob = await postBlob(buffer.toString("base64"), "pdf");
		documentUrls.push(blob.urlToMedia);
	}

	await db.post.update({
		where: { id, authorId: session.user.id },
		data: { document: documentUrls },
	});

	return "ok";
}
