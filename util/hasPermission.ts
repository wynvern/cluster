"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRole } from "@/lib/db/group/group";
import { getServerSession } from "next-auth";

export default async function hasPermission(
	groupname: string
): Promise<boolean> {
	const session = await getServerSession(authOptions);
	if (!session) return false;
	if (session.user.role === "admin") return true;

	const role = await getRole({ groupname });
	if (!role) return false;
	return ["owner", "moderator"].includes(role);
}
