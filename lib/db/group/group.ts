"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type Group from "./type";

function isValidGroupname(str: string) {
	const regex = /^[a-z0-9._]{1,20}$/;
	return regex.test(str);
}

type GroupId = { id: string; groupname?: string };
type GroupName = { id?: string; groupname: string };

export default async function fetchGroup(
	params: GroupId | GroupName
): Promise<Group | null> {
	const searchBy = params.id
		? { id: params.id }
		: { groupname: params.groupname };

	const query = await db.group.findUnique({
		where: params,
		select: {
			id: true,
			name: true,
			image: true,
			banner: true,
			groupname: true,
			ownerId: true,
			description: true,
			_count: {
				select: {
					posts: { where: { group: { ...searchBy } } },
					members: { where: { group: { ...searchBy } } },
				},
			},
		},
	});

	if (!query) return null;

	return query;
}

export async function createGroup(
	name: string,
	groupname: string,
	description: string,
	categories: string[]
) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";
	if (!groupname) return "no-data";

	if (!isValidGroupname(groupname)) {
		return "invalid-groupname";
	}

	const existingGroup = await db.group.findFirst({ where: { groupname } });

	if (existingGroup) {
		return "groupname-in-use";
	}

	const data = await db.group.create({
		data: {
			name,
			groupname,
			description,
			ownerId: session.user.id,
			categories,
		},
	});

	return data.id;
}

export async function updateGroup(
	id: string,
	name?: string,
	description?: string
) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";
	if (!name && !description) return "no-data";

	await db.group.update({
		where: { id, ownerId: session.user.id },
		data: {
			name: name,
			description: description,
		},
	});

	return "ok";
}
