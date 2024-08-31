"use client";

import PageHeader from "@/components/general/PageHeader";
import ScrollPagination from "@/components/general/ScrollPagination";
import PostList from "@/components/post/PostsList";
import { fetchUserFeed } from "@/lib/db/feed/feed";
import type Post from "@/lib/db/post/type";
import { useState } from "react";

export default function HomePage({ firstPosts }: { firstPosts: Post[] }) {
	const [posts, setPosts] = useState<Post[]>(firstPosts);
	const [loading, setLoading] = useState(false);
	const [offset, setOffset] = useState(10);
	const [noMoreData, setNoMoreData] = useState(false);

	async function fetchMorePosts() {
		if (noMoreData) return;

		setLoading(true);

		const newPosts = await fetchUserFeed(offset);
		if (typeof newPosts === "string") return;
		setOffset(offset + 10);

		if (newPosts.length === 0) {
			setNoMoreData(true);
			setLoading(false);
			return;
		}

		setPosts([...posts, ...newPosts]);
		setLoading(false);
	}

	return (
		<ScrollPagination
			loading={loading}
			noMoreData={noMoreData}
			onBottomReached={fetchMorePosts}
		>
			<div>
				<PageHeader title="Feed" />
				<PostList posts={posts} />
			</div>
		</ScrollPagination>
	);
}
