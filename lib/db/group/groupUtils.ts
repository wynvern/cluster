"use server";

import { db } from "@/lib/db";

const roles = ["member", "moderator", "owner"];

// Check hierarchy of roles for a given member
export async function memberHasPermission(
	userId: string,
	groupname: string,
	permission: "member" | "moderator" | "owner"
) {
	const role = await db.groupMember.findFirst({
		where: { userId, group: { groupname } },
		select: { role: true },
	});

	if (!role) return false;
	const userRoleIndex = roles.indexOf(role.role);
	const requiredRoleIndex = roles.indexOf(permission);

	return userRoleIndex >= requiredRoleIndex;
}
