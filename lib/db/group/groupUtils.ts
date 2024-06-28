"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

const roles = ["member", "moderator", "owner"];

// Check hierarchy of roles for a given member
export async function memberHasPermission(
	userId: string,
	groupname: string,
	permission: string
) {
	const session = await getServerSession(authOptions);
	if (!session) return false;

	console.log(userId);
	const role = await db.groupMember.findFirst({
		where: { userId, group: { groupname } },
		select: { role: true },
	});

	console.log(role);

	if (!role) return false;
	const userRoleIndex = roles.indexOf(role.role);
	const requiredRoleIndex = roles.indexOf(permission);

	console.log(userRoleIndex, requiredRoleIndex);

	return userRoleIndex >= requiredRoleIndex;
}
