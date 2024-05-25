"use client";

import NoPosts from "@/components/card/NoPosts";
import ScrollPagination from "@/components/general/ScrollPagination";
import PostsList from "@/components/post/PostsList";
import { fetchGroupPosts } from "@/lib/db/post/post";
import type Post from "@/lib/db/post/type";
import type Group from "@/lib/db/group/type";
import { useState } from "react";

interface GroupTabsProps {
	initialPosts: Post[] | null;
	group: Group;
}

function GroupPosts({
	group,
	initialPosts,
}: {
	group: Group;
	initialPosts: Post[] | null;
}) {
	const [posts, setPosts] = useState<Post[] | null>(initialPosts);
	const [loading, setLoading] = useState(false);
	const [noMoreData, setNoMoreData] = useState(false);

	async function fetchMorePosts(skip: number, take: number) {
		setLoading(true);
		const data = await fetchGroupPosts(group.id, { skip, take });
		if (data.length === 0) {
			setNoMoreData(true);
			setLoading(false);
			return false;
		}
		setPosts((prevPosts) => [...(prevPosts || []), ...data]);
		setLoading(false);
	}

	return (
		<ScrollPagination
			noMoreData={noMoreData}
			loading={loading}
			onBottomReached={fetchMorePosts}
		>
			<PostsList posts={posts} isUserPage={false} />
			{noMoreData && initialPosts && initialPosts.length >= 1 && (
				<div className="mt-4 py-6">
					<NoPosts message="Fim dos posts." />
				</div>
			)}
			{initialPosts?.length === 0 && (
				<div className="mt-4 py-6">
					<NoPosts message="O grupo não tem nenhum post." />
				</div>
			)}
		</ScrollPagination>
	);
}

export default function GroupTabs({ initialPosts, group }: GroupTabsProps) {
	return (
		<>
			<GroupPosts initialPosts={initialPosts} group={group} />
		</>
	);
}
