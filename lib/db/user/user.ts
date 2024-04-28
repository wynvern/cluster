"use server";

import { db } from "@/lib/db";
import type User from "./type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type UserId = { id: string; username?: string };
type UserName = { id?: string; username: string };

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

	return db.user.update({
		where: { id: session.user.id },
		data: {
			name: name,
			bio: bio,
		},
	});
}
