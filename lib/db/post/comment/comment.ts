"use server";

import { db } from "@/lib/db";
import type RecursiveComments from "./type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendNotification } from "@/lib/notification";

async function recursiveFetchComments(
	postId: string,
	parentId?: string,
	level = 0
) {
	if (level > 3) {
		return [];
	}

	const comments: RecursiveComments[] = await db.comment.findMany({
		where: parentId ? { parentId } : { postId, parentId: null },
		select: {
			id: true,
			text: true,
			authorId: true,
			postId: true,
			createdAt: true,
			parentId: true,
			media: true,
			document: true,
			author: {
				select: {
					id: true,
					image: true,
					username: true,
					name: true,
				},
			},
		},
	});
	for (const comment of comments) {
		comment.children = await recursiveFetchComments(
			postId,
			comment.id,
			level + 1
		);
	}
	return comments;
}

export async function fetchPostComments(postId: string) {
	const posts = await recursiveFetchComments(postId);
	return posts;
}

export async function createComment({
	text,
	postId,
	parentId,
	media,
	document,
}: {
	text: string;
	postId: string;
	parentId?: string;
	media?: string[];
	document?: string[];
}) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	if (!parentId) {
		const postAuthor = await db.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		});

		if (postAuthor?.authorId && postAuthor.authorId !== session.user.id) {
			sendNotification({
				receiverUserId: postAuthor?.authorId,
				message: {
					title: "New comment",
					body: "Someone commented on your post",
				},
			});
		}
	}

	return await db.comment.create({
		data: {
			text,
			authorId: session?.user.id,
			postId,
			parentId,
			media,
			document,
		},
		include: {
			author: {
				select: {
					id: true,
					image: true,
					username: true,
					name: true,
				},
			},
		},
	});
}
