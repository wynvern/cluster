import type User from "@/lib/db/group/type";
import { fetchGroupPosts } from "@/lib/db/post/post";
import GroupTabs from "./GroupTabs";

interface GroupContentProps {
	group: User;
}

export default async function GroupContent({ group }: GroupContentProps) {
	const posts = await fetchGroupPosts(group.id, { skip: 0, take: 20 });

	return (
		<div className="w-full">
			<GroupTabs initialPosts={posts} group={group} />
		</div>
	);
}
