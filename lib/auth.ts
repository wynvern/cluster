import type { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
			httpOptions: {
				timeout: 10000,
			},
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("missing-data");
				}

				const existingUser = await db.user.findUnique({
					where: {
						email: credentials?.email,
					},
				});
				if (!existingUser) {
					throw new Error("email-not-found");
				}
				if (!existingUser.password) {
					throw new Error("different-sign-in-provider");
				}

				const passwordMatch = await compare(
					credentials.password,
					existingUser.password
				);
				if (!passwordMatch) {
					throw new Error("password-not-match");
				}

				return existingUser as User;
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user, trigger, session, account, profile }) {
			console.log(token, user, session, account, profile);

			if (user) {
				// Add custom parameters to token
				token.role = user.role as string;
				token.fullName = user.fullName;
				// Add username to the token
				token.username = user.username as string;
				token.id = user.id;
				token.image = user.image;
				token.banner = user.banner;
				token.emailVerified = user.emailVerified as Date;
			}

			if (trigger === "update") {
				if (session.username) {
					token.username = session.username;
				}
				if (session.image) {
					token.image = session.image;
				}
				if (session.banner) {
					token.banner = session.banner;
				}
				if (session.emailVerified) {
					token.emailVerified = session.emailVerified;
				}
			}

			if (account?.provider === "google") {
				token.emailVerified = new Date();
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				// Transfer custom params from token to user in session
				session.user.role = token.role;
				session.user.fullName = token.fullName as string;
				session.user.id = token.id as string;
				session.user.emailVerified = token.emailVerified;
				// Transfer username to the session
				session.user.username = token.username as string;

				session.user.image = token.image as string;
				session.user.banner = token.banner as string;
			}
			return session;
		},
	},
};
