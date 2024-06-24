"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { compressImage, squareImage } from "../image";
import { db } from "../db";
import { postBlob } from "../blob";

const supportedTypes = ["png", "jpeg", "jpg", "webp", "gif"];

export async function uploadUserAvatar(file: string, fileType: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";
	const type = fileType.split("/")[1];

	if (!supportedTypes.includes(type)) return "invalid-type";

	// Sharp to fix image
	const buffer = Buffer.from(file, "base64");
	let processedImage = buffer;

	if (type !== "gif") {
		// Only compress image if it's not a gif
		processedImage = await squareImage(buffer);
	}

	const blob = await postBlob(
		processedImage.toString("base64"),
		type !== "gif" ? "png" : "gif"
	);

	await db.user.update({
		where: { id: session.user.id },
		data: { image: blob.urlToMedia },
	});

	return { url: blob.urlToMedia };
}

export async function uploadUserBanner(file: string, fileType: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";
	const type = fileType.split("/")[1];

	if (!supportedTypes.includes(type)) return "invalid-type";

	// Sharp to fix image
	const buffer = Buffer.from(file, "base64");
	let processedImage = buffer;

	if (type !== "gif") {
		// Only compress image if it's not a gif
		processedImage = await compressImage(buffer);
	}

	const blob = await postBlob(
		processedImage.toString("base64"),
		type !== "gif" ? "png" : "gif"
	);

	await db.user.update({
		where: { id: session.user.id },
		data: { banner: blob.urlToMedia },
	});

	return "ok";
}
