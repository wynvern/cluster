import type User from "@/lib/db/user/type";
import UserTabs from "./UserTabs";
import { fetchUserBookmarks, fetchUserPosts } from "@/lib/db/post/post";
import { fetchUserGroups } from "@/lib/db/user/user";

interface UserContentProps {
	user: User;
}

export default async function UserContent({ user }: UserContentProps) {
	const posts = await fetchUserPosts(user.id, {
		skip: 0,
		take: Number.parseInt(process.env.NEXT_PUBLIC_BATCH_FETCH_SIZE || "40"),
	});
	const bookmarks = await fetchUserBookmarks(user.id, {
		skip: 0,
		take: Number.parseInt(process.env.NEXT_PUBLIC_BATCH_FETCH_SIZE || "40"),
	});
	const groups = await fetchUserGroups(user.id);

	return (
		<div className="w-full">
			<UserTabs
				initialPosts={posts}
				initialBookmarks={bookmarks}
				initialGroups={groups}
				user={user}
			/>
		</div>
	);
}
