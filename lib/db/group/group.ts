"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type Group from "./type";

function isValidGroupname(str: string) {
	const regex = /^[a-z0-9._]{1,20}$/;
	return regex.test(str);
}

type groupname = { id: string; groupname?: string };
type GroupName = { id?: string; groupname: string };

export default async function fetchGroup(
	params: groupname | GroupName
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
			categories,
			members: {
				create: {
					userId: session.user.id,
					role: "owner",
				},
			},
			groupSettings: {
				create: {
					memberApproval: true,
					memberJoining: true,
					memberPosting: true,
				},
			},
		},
	});

	return data.id;
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

export async function updateGroup(
	id: string,
	name?: string,
	description?: string
) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";
	if (!name && !description) return "no-data";

	await db.group.update({
		where: {
			id,
			members: { some: { userId: session.user.id, role: "owner" } },
		},
		data: {
			name: name,
			description: description,
		},
	});

	return "ok";
}

export async function getMembers({ groupname }: { groupname: string }) {
	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return;

	const members = await db.groupMember.findMany({
		where: { groupId: group.id },
		select: {
			user: {
				select: {
					name: true,
					image: true,
					username: true,
					id: true,
				},
			},
			role: true,
			joinedAt: true,
		},
	});

	return [...members];
}

// TODO: See if node-cache is valid for this use case

const roleCache: { [userId: string]: { [groupId: string]: string | null } } =
	{};

export async function getRole({ groupname }: { groupname: string }) {
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;

	if (!userId || !groupname) {
		return undefined;
	}

	// Step 2: Check if the result is in the cache
	if (roleCache[userId]?.[groupname]) {
		return roleCache[userId][groupname];
	}

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return undefined;

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId: userId },
		select: { role: true },
	});

	// Step 4: Store the result in the cache
	if (!roleCache[userId]) {
		roleCache[userId] = {};
	}
	roleCache[userId][groupname] = String(member?.role);

	return member?.role;
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

async function isOwner({ groupname }: { groupname: string }) {
	const session = await getServerSession(authOptions);

	if (!session) return false;

	const group = await db.group.findUnique({
		where: { groupname },
		select: { members: { where: { userId: session.user.id } } },
	});

	if (!group) return false;

	return group.members[0].role === "owner";
}

export async function removeMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	if (!(await isOwner({ groupname }))) return "not-owner";

	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId: userId },
	});

	if (!member) return "not-member";

	await db.groupMember.delete({
		where: { groupId_userId: { groupId: group.id, userId } },
	});

	return "ok";
}

export async function promoteMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	if (!(await isOwner({ groupname }))) return "not-owner";

	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId: userId },
	});

	if (!member) return "not-member";

	await db.groupMember.update({
		where: { groupId_userId: { groupId: group.id, userId } },
		data: { role: "moderator" },
	});

	return "ok";
}

export async function unpromoteMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	if (!(await isOwner({ groupname }))) return "not-owner";

	const session = await getServerSession(authOptions);

	if (!session) return "no-session";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId: userId },
	});

	if (!member) return "not-member";

	await db.groupMember.update({
		where: { groupId_userId: { groupId: group.id, userId } },
		data: { role: "member" },
	});

	return "ok";
}
