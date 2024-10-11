"use server";

import { authOptions } from "@/lib/auth";
import { uploadPostDocument, uploadPostMedia } from "@/lib/blob/postBlob";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import type Post from "./type";
import { postSelection } from "../prismaSelections";
import { memberHasPermission } from "../group/groupUtils";

export async function createPost(
	title: string,
	content: string,
	media: { base64: string; fileType: string }[],
	documents: { base64: string; fileType: string; fileName: string }[],
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

	if (documents.length > 0) {
		const result = await uploadPostDocument(data.id, documents);

		if (result !== "ok") {
			throw new Error("Failed to upload document.");
		}
	}

	return data;
}

// Fetches the bookmarks for the session user for optimization purposes
export async function fetchGroupPosts(
	groupId: string,
	pagination?: { skip: number; take: number }
) {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const posts = await db.post.findMany({
		where: { groupId },
		orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
		skip: pagination?.skip,
		take: pagination?.take,
		select: { ...postSelection(session.user.id) },
	});

	return posts as Post[];
}

// Fetches the bookmarks for the session user for optimization purposes
export async function fetchUserPosts(
	authorId: string,
	pagination?: { skip: number; take: number }
) {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const posts = await db.post.findMany({
		where: { authorId },
		orderBy: [{ createdAt: "desc" }],
		skip: pagination?.skip,
		take: pagination?.take,
		select: {
			...postSelection(session.user.id),
		},
	});

	return posts as Post[];
}

export async function fetchUserBookmarks(
	userId: string,
	pagination?: { skip: number; take: number }
): Promise<Post[] | string> {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			userSettings: {
				select: {
					privateBookmarks: true,
				},
			},
		},
	});

	if (user?.userSettings?.privateBookmarks) {
		return "private-bookmarks";
	}

	if (!user) return [];

	const bookmarks = await db.bookmark.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: "desc" },
		skip: pagination?.skip,
		take: pagination?.take,
		select: { post: { select: { ...postSelection(session.user.id) } } },
	});
	const posts = bookmarks.map((bookmark) => bookmark.post);

	return posts;
}

export async function bookmarkPost(postId: string) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const post = await db.post.findUnique({
		where: { id: postId },
	});

	if (!post) return "post-not-found";

	await db.bookmark.upsert({
		where: {
			postId_userId: {
				userId: session.user.id,
				postId: postId,
			},
		},
		create: {
			userId: session.user.id,
			postId: postId,
		},
		update: {},
	});

	return "ok";
}

export async function unbookmarkPost(postId: string) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	await db.bookmark.delete({
		where: {
			postId_userId: {
				userId: session.user.id,
				postId: postId,
			},
		},
	});

	return "ok";
}

export async function fetchPostById(postId: string) {
	const session = await getServerSession(authOptions);
	if (!session) return null;

	await db.postView.upsert({
		where: {
			postId_viewerId: {
				postId: postId,
				viewerId: session.user.id,
			},
		},
		create: {
			postId: postId,
			viewerId: session.user.id,
		},
		update: {
			viewedAt: new Date(),
		},
	});

	const post = await db.post.findUnique({
		where: { id: postId },
		select: { ...postSelection(session.user.id) },
	});

	return post as Post;
}

export async function deletePost(postId: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const post = await db.post.findUnique({
		where: { id: postId },
		select: {
			authorId: true,
			group: {
				select: { groupname: true },
			},
		},
	});

	if (!post) return "post-not-found";

	const permission = await memberHasPermission(
		session.user.id,
		post.group.groupname,
		"moderator"
	);

	if (!permission && post.authorId !== session.user.id) return "unauthorized";

	await db.post.delete({
		where: { id: postId },
	});

	return "ok";
}

export async function pinPost({ postId }: { postId: string }) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const post = await db.post.findUnique({
		where: { id: postId },
		select: {
			group: {
				select: { members: { where: { userId: session.user.id } } },
			},
		},
	});

	if (!post) return "post-not-found";

	if (!["owner", "moderator"].includes(post.group.members[0].role))
		return "no-permission";

	await db.post.update({
		where: { id: postId },
		data: { pinned: true },
	});

	return "ok";
}

export async function unpinPost({ postId }: { postId: string }) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const post = await db.post.findUnique({
		where: { id: postId },
		select: {
			group: {
				select: { members: { where: { userId: session.user.id } } },
			},
		},
	});

	if (!post) return "post-not-found";

	if (!["owner", "moderator"].includes(post.group.members[0].role))
		return "no-permission";

	await db.post.update({
		where: { id: postId },
		data: { pinned: false },
	});

	return "ok";
}

export async function disapprovePost({ postId }: { postId: string }) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const post = await db.post.findUnique({
		where: { id: postId },
		select: {
			group: {
				select: { members: { where: { userId: session.user.id } } },
			},
		},
	});

	if (!post) return "post-not-found";

	if (!["owner", "moderator"].includes(post.group.members[0].role))
		return "no-permission";

	await db.post.update({
		where: { id: postId },
		data: { approved: false },
	});

	return "ok";
}

export async function approvePost({ postId }: { postId: string }) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const post = await db.post.findUnique({
		where: { id: postId },
		select: {
			group: {
				select: { members: { where: { userId: session.user.id } } },
			},
		},
	});

	if (!post) return "post-not-found";

	if (!["owner", "moderator"].includes(post.group.members[0].role))
		return "no-permission";

	await db.post.update({
		where: { id: postId },
		data: { approved: true },
	});

	return "ok";
}

export async function reportPost(
	postId: string,
	title: string,
	reason: string
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const post = await db.post.findUnique({
		where: { id: postId },
		select: { id: true },
	});

	if (!post) return "no-post";

	const alreadyReported = await db.postReport.findFirst({
		where: { creatorId: session.user.id, postId: postId },
	});

	if (alreadyReported) return "already-reported";

	const report = await db.postReport.create({
		data: {
			title: title,
			content: reason,
			creatorId: session.user.id,
			postId: post.id,
		},
	});

	if (!report) return "error";

	return "ok";
}
