"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { compressImage, squareImage } from "../image";
import { db } from "../db";
import { postBlob } from "../blob";
import supportedFormats from "../../public/supportedFormats.json";

interface fileNameBase64 {
	base64: string;
	name: string;
}

export async function uploadPostMedia(
	id: string,
	media: { base64: string; fileType: string }[]
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";
	const type = media[0].fileType.split("/")[1];

	const newMediaUrls = [];

	for (const mediaItem of media) {
		let buffer = Buffer.from(mediaItem.base64, "base64");
		if (supportedFormats.image.includes(type)) {
			buffer = await compressImage(buffer);
		}

		const blob = await postBlob(buffer.toString("base64"), type);
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
