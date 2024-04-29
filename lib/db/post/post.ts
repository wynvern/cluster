"use server";

import { db } from "@/lib/db";

export async function createPost(
	title: string,
	content: string,
	media: FileBase64Info[],
	groupId: string
) {
	const data = await db.post.create({
		data: { title, content, media, groupId },
	});
	return data;
}
