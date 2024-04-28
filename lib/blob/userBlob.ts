"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { put } from "@vercel/blob";
import { compressImage, squareImage } from "../image";
import { db } from "../db";

export async function uploadUserAvatar(file: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	// Sharp to fix image
	const buffer = Buffer.from(file, "base64");
	const processedImage = await squareImage(buffer);

	const blob = await put(session.user.id, processedImage, {
		access: "public",
		contentType: "image/png",
	});

	await db.user.update({
		where: { id: session.user.id },
		data: { image: blob.url },
	});

	return "ok";
}

export async function uploadUserBanner(file: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	// Sharp to fix image
	const buffer = Buffer.from(file, "base64");
	const processedImage = await compressImage(buffer);

	const blob = await put(session.user.id, processedImage, {
		access: "public",
		contentType: "image/png",
	});

	await db.user.update({
		where: { id: session.user.id },
		data: { banner: blob.url },
	});

	return "ok";
}
