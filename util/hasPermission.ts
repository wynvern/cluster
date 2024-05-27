"use server";

import { authOptions } from "@/lib/auth";
import { getRole } from "@/lib/db/group/group";
import { getServerSession } from "next-auth";

const roleHierarchy = ["member", "moderator", "owner"];

export default async function hasPermission(
	groupname: string,
	permission = "moderator",
	userId = null
): Promise<boolean> {
	const session = await getServerSession(authOptions);
	if (!session) return false;
	if (session.user.role === "admin") return true;

	const role = await getRole({ groupname });
	if (!role) return false;

	return roleHierarchy.indexOf(permission) <= roleHierarchy.indexOf(role);
}
