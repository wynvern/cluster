"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { compressImage, squareImage } from "../image";
import { db } from "../db";
import { createBlob } from "../blob";

export async function uploadUserAvatar(file: string, fileType: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const buffer = Buffer.from(file, "base64");
	const processedImage = await squareImage(buffer);

	const blobUrl = await createBlob(processedImage, "user", {
		type: fileType,
		name: `${session.user.id}-profile.${fileType}`,
	});

	await db.user.update({
		where: { id: session.user.id },
		data: { image: blobUrl },
	});

	return { url: blobUrl };
}

export async function uploadUserBanner(file: string, fileType: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const buffer = Buffer.from(file, "base64");
	const compressedImage = await compressImage(buffer);
	const blobUrl = await createBlob(compressedImage, "user", {
		type: fileType,
		name: `${session.user.id}-banner.${fileType}`,
	});

	await db.user.update({
		where: { id: session.user.id },
		data: { banner: blobUrl },
	});

	return { url: blobUrl };
}
