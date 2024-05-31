"use server";

import { db } from "@/lib/db";
import type User from "./type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hash } from "bcrypt";

type UserId = { id: string; username?: string };
type UserName = { id?: string; username: string };

export async function createUser(
	email: string,
	password: string,
	numberval: string
) {
	if (numberval) return "error"; // Honeypot

	try {
		const hashedPassword = await hash(password, 10);
		await db.user.create({
			data: {
				email: email,
				password: hashedPassword,
			},
		});
	} catch (e) {
		return "error";
	}

	return "ok";
}

export default async function fetchUser(
	params: UserId | UserName
): Promise<User | null> {
	const session = await getServerSession(authOptions);
	if (!session) return null;

	const searchBy = params.id
		? { id: params.id }
		: { username: params.username };

	const query = await db.user.findUnique({
		where: {
			...params,
			NOT: {
				OR: [
					{ blockedUsers: { some: { blockedId: session.user.id } } },
					{ blockedBy: { some: { userId: session.user.id } } },
				],
			},
		},
		select: {
			id: true,
			name: true,
			image: true,
			banner: true,
			username: true,
			bio: true,
			_count: {
				select: {
					posts: { where: { author: { ...searchBy } } },
					bookmarks: { where: { user: { ...searchBy } } },
					groups: { where: { user: { ...searchBy } } },
				},
			},
		},
	});

	if (!query) return null;

	return query;
}

export async function updateUser(name?: string, bio?: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	await db.user.update({
		where: { id: session.user.id },
		data: {
			name: name,
			bio: bio,
		},
	});

	return "ok";
}

export async function getNotifications() {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const notifications = await db.notification.findMany({
		where: { userId: session.user.id },
	});

	await db.notification.updateMany({
		where: {
			userId: session.user.id,
			viewed: false,
		},
		data: {
			viewed: true,
		},
	});

	return notifications;
}

export async function fetchUserGroups(
	userId: string,
	options?: { groupChatId?: boolean }
) {
	const queryOptions = {
		where: { members: { some: { userId: userId } } },
		include: {},
	};

	if (options?.groupChatId) {
		queryOptions.include = {
			GroupChat: {
				select: {
					id: true,
				},
			},
		};
	}

	const groups = await db.group.findMany(queryOptions);

	return groups;
}

export async function blockUser(userId: string) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	await db.blockedUser.create({
		data: {
			userId: session.user.id,
			blockedId: userId,
		},
	});

	return "ok";
}

export async function unblockUser(userId: string) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	await db.blockedUser.delete({
		where: {
			userId_blockedId: { userId: session.user.id, blockedId: userId },
		},
	});

	return "ok";
}

export async function enterGroup({ groupname }: { groupname: string }) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId: session.user.id },
	});

	if (member) return "already-member";

	await db.groupMember.create({
		data: {
			groupId: group.id,
			userId: session.user.id,
			role: "member",
		},
	});

	return "ok";
}

export async function exitGroup({ groupname }: { groupname: string }) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId: session.user.id },
	});

	if (!member) return "not-member";

	await db.groupMember.delete({
		where: {
			groupId_userId: { groupId: group.id, userId: session.user.id },
		},
	});

	return "ok";
}

export async function reportUser(
	username: string,
	title: string,
	reason: string
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const user = await db.user.findUnique({
		where: { username },
		select: { id: true },
	});

	if (!user) return "no-user";

	const report = await db.userReport.create({
		data: {
			title: title,
			content: reason,
			creatorId: session.user.id,
			reportedUserId: user.id,
		},
	});

	if (!report) return "error";

	return "ok";
}

export async function cleanUserNotifications() {
	const session = await getServerSession(authOptions);
	if (!session) return;

	await db.notification.deleteMany({
		where: { viewed: true, userId: session.user.id },
	});

	return "ok";
}
