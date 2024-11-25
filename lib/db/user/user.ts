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
	numberval: string,
) {
	if (numberval) return "error"; // Honeypot

	try {
		// Check if the email is already in use
		const existingUser = await db.user.findUnique({
			where: { email: email },
		});
		if (existingUser) {
			return "email already in use";
		}

		const hashedPassword = await hash(password, 10);
		const newUser = await db.user.create({
			data: {
				email: email,
				password: hashedPassword,
			},
		});

		AddUserToMain(newUser.id);

		await db.userSettings.create({ data: { userId: newUser.id } });
	} catch (e) {
		return "error";
	}

	return "ok";
}

export async function AddUserToMain(userId: string) {
	await db.groupMember.upsert({
		create: {
			groupId: process.env.GROUP_UUID_TO_ADD || "",
			userId: userId,
			role: "member",
		},
		update: {},
		where: {
			groupId_userId: {
				userId,
				groupId: process.env.GROUP_UUID_TO_ADD || "",
			},
		},
	});
}

export default async function fetchUser(
	params: UserId | UserName,
): Promise<User | string> {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

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
			createdAt: true,
			_count: {
				select: {
					posts: { where: { author: { ...searchBy } } },
					bookmarks: { where: { user: { ...searchBy } } },
					groups: { where: { user: { ...searchBy } } },
				},
			},
			userSettings: {
				select: {
					privateProfile: true,
				},
			},
		},
	});

	if (query?.userSettings?.privateProfile) {
		return "private-profile";
	}

	if (!query) return "no-match";

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
	options?: { groupChatId?: boolean },
) {
	const user = await db.user.findFirst({
		where: { id: userId },
		select: {
			userSettings: {
				select: {
					privateGroups: true,
				},
			},
		},
	});

	if (!user) {
		return "user-not-found";
	}
	if (user?.userSettings?.privateGroups) {
		return "private-user-groups";
	}

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

	if (member.role === "owner") {
		return "owner-cannot-exit";
	}

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
	reason: string,
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const user = await db.user.findUnique({
		where: { username },
		select: { id: true },
	});

	if (!user) return "no-user";

	const alreadyReported = await db.userReport.findFirst({
		where: { reportedUserId: user.id, creatorId: session.user.id },
	});

	if (alreadyReported) return "already-reported";

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

export async function fetchBlockedUsers() {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const blockedUsers = await db.blockedUser.findMany({
		where: { userId: session.user.id },
		select: {
			blocked: {
				select: {
					id: true,
					name: true,
					username: true,
					image: true,
					bio: true,
				},
			},
		},
	});

	return blockedUsers.map((user) => user.blocked);
}

export async function fetchUserSettings() {
	const session = await getServerSession(authOptions);
	if (!session) return null;

	const settings = await db.userSettings.findUnique({
		where: { userId: session.user.id },
	});

	return settings;
}

export async function updateUserSettings({
	privateProfile,
	privateBookmarks,
	privateGroups,
	disableNotifications,
	theme,
}: {
	privateProfile?: boolean;
	privateBookmarks?: boolean;
	privateGroups?: boolean;
	disableNotifications?: boolean;
	theme?: "light" | "dark"; // Make theme optional as well
}) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const updateData = {
		...(privateProfile !== undefined && { privateProfile }),
		...(privateBookmarks !== undefined && { privateBookmarks }),
		...(privateGroups !== undefined && { privateGroups }),
		...(disableNotifications !== undefined && { disableNotifications }),
		...(theme !== undefined && { theme }),
	};

	await db.userSettings.update({
		where: { userId: session.user.id },
		data: updateData,
	});

	return "ok";
}

export async function fetchUserReports() {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const reports = await db.userReport.findMany({
		select: {
			content: true,
			title: true,
			createdAt: true,
			reportedUser: {
				select: {
					id: true,
					name: true,
					username: true,
					image: true,
				},
			},
		},
	});

	return reports;
}

export async function getUserGroupRoles() {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const roles = await db.groupMember.findMany({
		where: { userId: session.user.id },
		select: {
			role: true,
			group: {
				select: {
					groupname: true,
				},
			},
		},
	});

	return roles.map((role) => ({
		groupname: role.group.groupname,
		role: role.role,
	}));
}
