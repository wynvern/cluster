"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hash } from "bcrypt";

export async function reportProfile(
	username: string,
	title: string,
	reason: string
) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const user = await db.user.findUnique({
		where: { username },
		select: { id: true },
	});

	if (!user) return "no-user";

	const report = await db.userReport.create({
		data: {
			title: title,
			content: reason,
			creatorId: session.user.id,
			reportedUserId: user.id,
		},
	});

	if (!report) return "error";

	return "ok";
}
