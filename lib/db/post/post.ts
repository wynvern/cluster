"use server";

import { authOptions } from "@/lib/auth";
import { uploadPostDocument, uploadPostMedia } from "@/lib/blob/postBlob";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function createPost(
	title: string,
	content: string,
	media: string[],
	document: string[],
	groupId: string
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error("You must be signed in to create a post.");
	}
	// TODO: Validate if the user actually has permission to post

	const authorId = session.user.id;

	const data = await db.post.create({
		data: { title, content, groupId, authorId },
	});

	if (media.length > 0) {
		const result = await uploadPostMedia(data.id, media);

		if (result !== "ok") {
			throw new Error("Failed to upload media.");
		}
	}

	if (document.length > 0) {
		const documentToSend = document.map((doc) => {
			const [base64, name] = doc.split(";");
			return { base64, name: name.split("=")[1] };
		});
		const result = await uploadPostDocument(data.id, documentToSend);

		if (result !== "ok") {
			throw new Error("Failed to upload document.");
		}
	}

	return "post-created";
}

export async function fetchGroupPosts(groupId: string) {
	const posts = await db.post.findMany({
		where: { groupId },
		orderBy: { createdAt: "desc" },
		include: {
			author: {
				select: {
					id: true,
					username: true,
					image: true,
				},
			},
			group: {
				select: {
					id: true,
					groupname: true,
					image: true,
				},
			},
		},
	});

	return posts;
}

export async function fetchUserPosts(authorId: string) {
	const posts = await db.post.findMany({
		where: { authorId },
		orderBy: { createdAt: "desc" },
		include: {
			author: {
				select: {
					id: true,
					username: true,
					image: true,
				},
			},
			group: {
				select: {
					id: true,
					groupname: true,
					image: true,
				},
			},
		},
	});

	return posts;
}
