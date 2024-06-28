"use server";

import {
	randomBytes,
	createCipheriv,
	createHash,
	createDecipheriv,
} from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const ENCRYPTION_KEY = "iiiiiiiiiiiiiiiiiiiiiiiiiiiiii"; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function generateToken(userId: string, expirationTime = 3600000) {
	// 1 hour default
	const token = {
		userId,
		expiresAt: Date.now() + expirationTime,
		random: randomBytes(16).toString("hex"), // Add randomness
	};
	return JSON.stringify(token);
}

function encryptToken(token: string) {
	let iv = randomBytes(IV_LENGTH);
	// Ensure the key is 32 bytes long
	let hash = createHash("sha256")
		.update(String(ENCRYPTION_KEY))
		.digest("base64")
		.substr(0, 32);
	let cipher = createCipheriv("aes-256-cbc", Buffer.from(hash), iv);
	let encrypted = cipher.update(token);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export async function generateSecretToken() {
	const session = await getServerSession(authOptions);
	if (!session) return null;

	const token = generateToken(session.user.id);
	return encryptToken(token);
}

export async function decryptToken(encryptedToken: string) {
	let [iv, encryptedText] = encryptedToken.split(":");
	let ivBuffer = Buffer.from(iv, "hex");
	// Ensure the key is 32 bytes long
	let hash = createHash("sha256")
		.update(String(ENCRYPTION_KEY))
		.digest("base64")
		.substr(0, 32);
	let decipher = createDecipheriv(
		"aes-256-cbc",
		Buffer.from(hash, "utf-8"),
		ivBuffer
	);
	let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return JSON.parse(decrypted.toString());
}
