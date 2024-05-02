"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import sendMail from "@/lib/mail";
import { getServerSession } from "next-auth";

function generateRandomString(length: number): string {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

export async function verifyEmail(code: string) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return "no-session";
	}

	const codeEntry = await db.codeVerifyAccount.findUnique({
		where: { code },
	});

	if (!codeEntry) {
		return "invalid-code";
	}

	const { email, expiry } = codeEntry;

	if (session.user.email !== email) {
		return "invalid-email";
	}

	const currentTime = new Date().getTime();

	if (expiry.getTime() < currentTime) {
		await db.codeVerifyAccount.delete({ where: { code } });
		return "code-expired";
	}

	await db.user.update({
		where: { email },
		data: { emailVerified: new Date() },
	});

	await db.codeVerifyAccount.delete({
		where: { code },
	});

	return "email-verified";
}

export async function sendCode(): Promise<string> {
	const session = await getServerSession(authOptions);

	if (!session || !session.user || !session.user.email) return "no-session";

	const email = session.user.email;

	const existingCode = await db.codeVerifyAccount.findFirst({
		where: { email },
	});

	if (existingCode) {
		return "request-already-pending";
	}

	const newCode = generateRandomString(5);

	const expiryTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

	await db.codeVerifyAccount.create({
		data: { code: newCode, email, expiry: new Date(expiryTime) },
	});

	sendMail(
		email,
		"Confirmar seu email.",
		`
            <h1>Confirmar seu email.</h1>
            <p>Utilize o código abaixo para verficar o seu email.</p>
            <a>Seu código de verificação: ${newCode}</a>
         `
	);

	return "code-sent";
}
