"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { put } from "@vercel/blob";
import { compressImage, squareImage } from "../image";
import { db } from "../db";

export async function uploadGroupImage(id: string, file: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	// Sharp to fix image
	const buffer = Buffer.from(file, "base64");
	const processedImage = await squareImage(buffer);

	const blob = await put(`group_images/${id}`, processedImage, {
		access: "public",
		contentType: "image/png",
	});

	// TODO: VAlidade if user has permission

	await db.group.update({
		where: { id },
		data: { image: blob.url },
	});

	return "ok";
}

export async function uploadGroupBanner(id: string, file: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	// Sharp to fix image
	const buffer = Buffer.from(file, "base64");
	const processedImage = await compressImage(buffer);

	const blob = await put(`group_banners/${id}`, processedImage, {
		access: "public",
		contentType: "image/png",
	});

	// TODO: validate if user has permission

	await db.group.update({
		where: { id },
		data: { banner: blob.url },
	});

	return "ok";
}
