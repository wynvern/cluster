"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

function isValidUsername(str: string) {
	const regex = /^[a-z0-9._]{1,20}$/;
	return regex.test(str);
}

export default async function completeProfile(username: string) {
	const session = await getServerSession(authOptions);
	const choosenUsername = username.toLowerCase();

	if (!session || !session.user.email) {
		return "no-session";
	}

	if (!isValidUsername(choosenUsername)) {
		return "invalid-username";
	}

	const existingUser = await db.user.findFirst({
		where: {
			username: choosenUsername,
		},
	});

	if (existingUser) {
		return "username-in-use";
	}

	await db.user.update({
		where: { email: session.user.email },
		data: { username: choosenUsername },
	});

	return "username-set";
}
