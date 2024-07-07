"use client";

import PostCard from "@/components/card/PostCard";
import ScrollPagination from "@/components/general/ScrollPagination";
import { fetchUserFeed } from "@/lib/db/feed/feed";
import type Post from "@/lib/db/post/type";
import { useState } from "react";

export default function HomePage({ firstPosts }: { firstPosts: Post[] }) {
	const [posts, setPosts] = useState(firstPosts);
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
				{posts.map((post) => (
					<div key={post.id}>
						<div className="w-full bottom-border my-6" />

						<div className="px-10">
							<PostCard post={post} />
						</div>
					</div>
				))}
			</div>
		</ScrollPagination>
	);
}
