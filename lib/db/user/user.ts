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
		const user = await db.user.create({
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
	const searchBy = params.id
		? { id: params.id }
		: { username: params.username };

	const query = await db.user.findUnique({
		where: params,
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

	return notifications;
}

export async function fetchUserGroups(options: { groupChatId?: boolean }) {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const queryOptions = {
		where: { members: { some: { userId: session.user.id } } },
		include: {},
	};

	if (options.groupChatId) {
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
