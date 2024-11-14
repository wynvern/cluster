"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import {
	groupSelection,
	postSelection,
	userSelection,
} from "../prismaSelections";

export async function searchUser(searchParam: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const users = await db.user.findMany({
		where: {
			OR: [
				{
					username: {
						contains: searchParam,
						mode: "insensitive",
					},
				},
				{
					name: {
						contains: searchParam,
						mode: "insensitive",
					},
				},
			],
		},
		select: userSelection(),
	});

	if (!users) return "no-users";

	return users;
}

export async function searchGroup(searchParam: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const groups = await db.group.findMany({
		where: {
			OR: [
				{
					groupname: {
						contains: searchParam,
						mode: "insensitive",
					},
				},
				{
					name: {
						contains: searchParam,
						mode: "insensitive",
					},
				},
			],
		},
		select: groupSelection(),
	});

	if (!groups) return "no-groups";

	return groups;
}

export async function searchPost(searchParam: string) {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const posts = await db.post.findMany({
		where: {
			OR: [
				{
					title: {
						contains: searchParam,
						mode: "insensitive",
					},
				},
				{
					content: {
						contains: searchParam,
						mode: "insensitive",
					},
				},
			],
		},
		select: { ...postSelection(session.user.id) },
	});

	if (!posts) return "no-posts";

	return posts;
}
