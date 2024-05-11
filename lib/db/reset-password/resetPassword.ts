"use server";

import { db } from "@/lib/db";
import sendMail from "@/lib/mail";
import { hash } from "bcrypt";

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
