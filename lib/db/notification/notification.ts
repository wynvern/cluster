"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function cleanNotifications() {
	const session = await getServerSession(authOptions);
	if (!session) return;

	await db.notification.deleteMany({
		where: { viewed: true, userId: session.user.id },
	});

	return "ok";
}
