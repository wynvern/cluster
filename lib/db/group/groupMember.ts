"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { memberHasPermission } from "./groupUtils";
import { sendNotification } from "@/lib/notification";

// Bans a member from a group
export async function banMember({
	groupname,
	userId,
	reason,
}: {
	groupname: string;
	userId: string;
	reason: string;
}) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";
	if (!(await memberHasPermission(session.user.id, groupname, "moderator")))
		return "no-permission";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	await db.groupMember.delete({
		where: { groupId_userId: { groupId: group.id, userId } },
	});

	await db.bannedGroupUser.create({
		data: {
			groupId: group.id,
			userId,
			reason,
		},
	});

	await sendNotification({
		receiverUserId: userId,
		message: {
			title: `Você foi banido do grupo ${groupname}`,
			body: `Motivo: ${reason}`,
			image: group.image || undefined,
		},
	});

	return "ok";
}

// Promotes a member to moderator role in a group
export async function promoteMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	if (!(await memberHasPermission(session.user.id, groupname, "owner")))
		return "no-permission";

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

// Demotes a member from moderator role to member role in a group
export async function demoteMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	if (!(await memberHasPermission(userId, groupname, "moderator")))
		return "no-permission";

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

// Removes a member from a group
export async function removeMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	if (!(await memberHasPermission(userId, groupname, "moderator")))
		return "no-permission";

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

export async function getMemberRoleByGroupname({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return null;

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId },
		select: { role: true },
	});

	if (!member) return null;

	return member.role;
}

// Gets the role of a member in a group
export async function getMemberRole({ groupname }: { groupname: string }) {
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;

	if (!userId || !groupname) {
		return null;
	}

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return null;

	const member = await db.groupMember.findFirst({
		where: { groupId: group.id, userId: userId },
		select: { role: true },
	});

	if (!member) return null;

	return member.role;
}

// Gets all members of a group
export async function getGroupMembers({ groupname }: { groupname: string }) {
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

// gets the banned group members
export async function getBannedGroupMembers({
	groupname,
}: {
	groupname: string;
}) {
	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return;

	const bannedMembers = await db.bannedGroupUser.findMany({
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
			reason: true,
			bannedAt: true,
		},
	});

	return [...bannedMembers];
}

// Unbans a member from a group
export async function unbanMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";
	if (!(await memberHasPermission(session.user.id, groupname, "moderator")))
		return "no-permission";

	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	await db.bannedGroupUser.delete({
		where: { groupId_userId: { groupId: group.id, userId } },
	});

	return "ok";
}

// Kicks a member
export async function kickMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	const group = await db.group.findUnique({
		where: { groupname },
	});

	if (!group) return "group-not-found";

	await db.groupMember.delete({
		where: { groupId_userId: { groupId: group.id, userId } },
	});

	return "ok";
}

// Unpromote member
export async function unpromoteMember({
	groupname,
	userId,
}: {
	groupname: string;
	userId: string;
}) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	if (!(await memberHasPermission(session.user.id, groupname, "owner")))
		return "no-permission";

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
