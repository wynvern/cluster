"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type Group from "./type";
import { memberHasPermission } from "./groupUtils";

// Checks if the groupname is valid
function isValidGroupname(str: string) {
	const regex = /^[a-z0-9._]{1,20}$/;
	return regex.test(str);
}

type groupname = { id: string; groupname?: string };
type GroupName = { id?: string; groupname: string };

// Fetches a group by its id or groupname
export default async function fetchGroup(
	params: groupname | GroupName
): Promise<Group | null> {
	const session = await getServerSession(authOptions);
	if (!session) return null;

	const searchBy = params.id
		? { id: params.id }
		: { groupname: params.groupname };

	const query = await db.group.findUnique({
		where: {
			...params,
			bannedUsers: { none: { userId: session.user.id } },
		},
		select: {
			id: true,
			name: true,
			image: true,
			banner: true,
			categories: true,
			groupname: true,
			description: true,
			GroupChat: {
				select: {
					id: true,
				},
			},
			_count: {
				select: {
					posts: { where: { group: { ...searchBy } } },
					members: { where: { group: { ...searchBy } } },
				},
			},
			createdAt: true,
		},
	});

	if (!query) return null;

	const isUserMember = await db.groupMember.findFirst({
		where: {
			groupId: query.id,
			userId: session.user.id,
		},
	});

	// Add view to group_views
	await db.groupView.upsert({
		where: {
			groupId_viewerId: {
				groupId: query.id,
				viewerId: session.user.id || "",
			},
		},
		create: { groupId: query.id, viewerId: session.user.id || "" },
		update: { viewedAt: new Date() },
	});

	return { ...query, isUserMember: !!isUserMember };
}

// Creates a new group
export async function createGroup(
	name: string,
	groupname: string,
	description: string,
	categories: string[]
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	if (!groupname) return "no-data";

	if (description && description.length > 500) {
		return "description-too-long";
	}

	if (categories.length > 5) {
		return "too-many-categories";
	}

	if (categories.length < 1) {
		return "no-categories";
	}

	if (name && name.length > 50) {
		return "name-too-long";
	}

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
					memberJoining: true,
					memberPosting: true,
				},
			},
			GroupChat: {
				create: {},
			},
		},
	});

	return data.id;
}

// Updates a group's name and description
export async function updateGroup(
	id: string,
	name?: string,
	description?: string
) {
	const session = await getServerSession(authOptions);

	if (!session) return "no-session";
	if (!name && !description) return "no-data";

	if (description && description.length > 500) {
		return "description-too-long";
	}

	if (name && name.length > 50) {
		return "name-too-long";
	}

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

// Deletes a group
export async function fetchRecentGroups() {
	const session = await getServerSession(authOptions);
	if (!session) return [];

	const groups = await db.groupView.findMany({
		where: {
			viewerId: session.user.id,
		},
		select: {
			group: {
				select: {
					id: true,
					name: true,
					groupname: true,
					image: true,
					banner: true,
				},
			},
		},
	});

	return groups.map((group) => group.group);
}

// Reports a group
export async function reportGroup(
	groupname: string,
	content: { title: string; content: string }
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const group = await db.group.findUnique({
		where: { groupname },
		select: { id: true },
	});

	if (!group) return "no-group";

	await db.groupReport.create({
		data: {
			title: content.title,
			creatorId: session.user.id,
			content: content.content,
			groupId: group.id,
		},
	});

	return "ok";
}

// Fetches the settings of a group
export async function fetchGroupSettings({ groupname }: { groupname: string }) {
	const session = await getServerSession(authOptions);
	if (!session) return null;

	const groupSettings = await db.groupSetting.findFirst({
		where: { group: { groupname } },
	});

	if (!groupSettings) return null;

	return groupSettings;
}

// Updates the settings of a group
export async function updateGroupSetting({
	groupname,
	memberPosting,
	memberJoining,
}: {
	groupname: string;
	memberPosting: boolean;
	memberJoining: boolean;
}) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	if (!(await memberHasPermission(session.user.id, groupname, "moderator")))
		return "no-permission";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	await db.groupSetting.update({
		where: { groupId: group.id },
		data: { memberPosting, memberJoining },
	});

	return "ok";
}
