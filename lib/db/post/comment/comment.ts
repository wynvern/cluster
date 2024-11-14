"use server";

import { db } from "@/lib/db";
import type RecursiveComments from "./type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendNotification } from "@/lib/notification";
import { FileBase64Info } from "@/util/getFile";
import { createBlob } from "@/lib/blob";
import { compressImage } from "@/lib/image";

async function recursiveFetchComments(
	postId: string,
	parentId?: string,
	level = 0,
) {
	if (level > 4) {
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
			level + 1,
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
					title: `u/${session.user.username} comentou em seu post`,
					body: `${text.slice(0, 50)}`,
					url: `/post/${postId}`,
					image: session.user.image || "/brand/default-avatar.svg",
				},
			});
		}
	} else {
		const parentComment = await db.comment.findUnique({
			where: { id: parentId },
			select: { authorId: true },
		});

		if (parentComment?.authorId && parentComment.authorId !== session.user.id) {
			sendNotification({
				receiverUserId: parentComment?.authorId,
				message: {
					title: `u/${session.user.username} respondeu seu comentário`,
					body: `${text.slice(0, 50)}`,
					url: `/post/${postId}`,
					image: session.user.image || "/brand/default-avatar.svg",
				},
			});
		}
	}

	let newMediaUrls = [];

	if (media) {
		newMediaUrls = [];

		for (const mediaItem of media) {
			const buffer = Buffer.from(mediaItem, "base64");
			const compressedImage = await compressImage(buffer);
			const blobUrl = await createBlob(compressedImage, "comment", {
				type: "image/jpeg", // Assuming the media type is jpeg, adjust as necessary
				name: `${session.user.id}-image-${media.indexOf(mediaItem)}.jpeg`,
			});
			newMediaUrls.push(blobUrl);
		}
	}

	return await db.comment.create({
		data: {
			text,
			authorId: session?.user.id,
			postId,
			parentId,
			media: newMediaUrls,
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
