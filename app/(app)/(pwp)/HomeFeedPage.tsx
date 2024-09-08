"use client";

import InfoMessage from "@/components/card/InfoMessage";
import PageHeader from "@/components/general/PageHeader";
import ScrollPagination from "@/components/general/ScrollPagination";
import PostList from "@/components/post/PostsList";
import { useSidebarStore } from "@/hooks/MobileHomeSidebar";
import { fetchUserFeed } from "@/lib/db/feed/feed";
import type Post from "@/lib/db/post/type";
import { Bars2Icon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function HomePage({ firstPosts }: { firstPosts: Post[] }) {
	const [posts, setPosts] = useState<Post[]>(firstPosts);
	const [loading, setLoading] = useState(false);
	const [offset, setOffset] = useState(10);
	const [noMoreData, setNoMoreData] = useState(false);
	const setIsSidebarOpen = useSidebarStore((state) => state.setIsSidebarOpen);

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
			{posts.length === 0 && (
				<div className="w-full h-full flex items-center justify-center">
					<InfoMessage message="Os posts dos grupos que você segue aparecerão aqui." />
				</div>
			)}
			<div>
				<PageHeader title="Feed">
					<Button
						className="bg-background sidebar-button"
						variant="bordered"
						size="sm"
						isIconOnly={true}
						onClick={() => setIsSidebarOpen(true)}
					>
						<Bars2Icon className="w-6 h-6" />
					</Button>
				</PageHeader>
				<PostList posts={posts} />
			</div>
		</ScrollPagination>
	);
}
