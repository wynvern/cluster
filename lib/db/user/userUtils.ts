"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import sendMail from "@/lib/mail";
import { hash } from "bcrypt";
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

	return choosenUsername;
}

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

	if (process.env.NODE_ENV === "development") {
		console.log("[Dev] Code: ", newCode);
	}

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

export async function sendResetRequest(email: string) {
	const user = await db.user.findFirst({ where: { email } });

	if (!user) {
		return "user-not-found";
	}

	if (!user.password) {
		return "different-oauth-provider";
	}

	const existingCode = await db.codeReset.findFirst({
		where: { email },
	});

	if (existingCode) {
		const expiryTime = existingCode.expiry.getTime();
		const currentTime = new Date().getTime();

		if (expiryTime > currentTime) {
			return "code-already-sent";
		}

		await db.codeReset.delete({ where: { id: existingCode.code } });
	}

	const newCode = generateRandomString(50);

	const expiryTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

	await db.codeReset.create({
		data: { code: newCode, email, expiry: new Date(expiryTime) },
	});

	const link = `${
		process.env.NEXTAUTH_URL
	}/new-password?verificationCode=${newCode}&expTime=${new Date().getTime()}`;

	// Send the link to the user's email...

	if (process.env.NODE_ENV === "development") {
		console.log("[Dev] Link: ", link);
	}

	sendMail(
		email,
		"Atualize sua senha.",
		`
         <h1>Atualize sua senha.</h1>
         <p>Clique no link abaixo para atualizar a sua senha. Sua requisição expira em 5 minutos.</p>
         <a href="${link}">Atualizar senha</a>
      `
	);

	return "code-sent";
}

export async function updatePassword(code: string, newPassword: string) {
	const existingCode = await db.codeReset.findFirst({
		where: { code },
	});

	if (!existingCode) {
		return "invalid-code";
	}

	const expiryTime = existingCode.expiry.getTime();
	const currentTime = new Date().getTime();

	if (expiryTime < currentTime) {
		return "code-expired";
	}

	const hashedPassword = await hash(newPassword, 10);

	await db.user.update({
		where: { email: existingCode.email },
		data: { password: hashedPassword },
	});

	await db.codeReset.delete({ where: { id: existingCode.code } });

	return "password-updated";
}
