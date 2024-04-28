"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { put } from "@vercel/blob";
import { squareImage } from "../image";

export async function uploadUserAvatar(file: string) {
	const session = await getServerSession(authOptions);
	const buffer = Buffer.from(file, "base64");
	if (!session) return "no-session";

	// Sharp to fix image
	const processedImage = await squareImage(buffer);

	const blob = await put(session.user.id, processedImage, {
		access: "public",
		contentType: "image/png",
	});

	console.log(blob);
}
