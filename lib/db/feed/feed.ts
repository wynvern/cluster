import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { postSelection } from "../prismaSelections";

export async function fetchUserFeed() {
	const session = await getServerSession(authOptions);
	if (!session) return "no-session";

	const posts = await db.post.findMany({
		where: { group: { members: { some: { userId: session.user.id } } } },
		select: { ...postSelection(session.user.id) },
		orderBy: {
			createdAt: "desc",
		},
	});

	return posts;
}
