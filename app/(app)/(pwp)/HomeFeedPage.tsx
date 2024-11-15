"use client";

import InfoMessage from "@/components/card/InfoMessage";
import PageHeader from "@/components/general/PageHeader";
import ScrollPagination from "@/components/general/ScrollPagination";
import PostList from "@/components/post/PostsList";
import { useSidebarStore } from "@/hooks/MobileHomeSidebar";
import { useUserRoleStore } from "@/hooks/role";
import { fetchUserFeed } from "@/lib/db/feed/feed";
import type Post from "@/lib/db/post/type";
import { Bars2Icon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function HomePage({
	firstPosts,
	userGroupRoles,
}: {
	firstPosts: Post[];
	userGroupRoles: { groupname: string; role: string }[];
}) {
	const [posts, setPosts] = useState<Post[]>(firstPosts);
	const [loading, setLoading] = useState(false);
	const [offset, setOffset] = useState(
		Number.parseInt(process.env.NEXT_PUBLIC_BATCH_FETCH_SIZE || "40"),
	);
	const [noMoreData, setNoMoreData] = useState(false);
	const setIsSidebarOpen = useSidebarStore((state) => state.setIsSidebarOpen);
	const setUserRole = useUserRoleStore((state) => state.setUserRole);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		for (const role of userGroupRoles) {
			setUserRole(role.groupname, role.role);
		}
	}, []);

	//  Fetch all group roles for the user to update zustand

	async function fetchMorePosts() {
		if (noMoreData) return;

		setLoading(true);

		const newPosts = await fetchUserFeed(offset);
		if (typeof newPosts === "string") return;
		setOffset(
			offset +
				Number.parseInt(process.env.NEXT_PUBLIC_BATCH_FETCH_SIZE || "40"),
		);

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
				<PostList posts={posts} isUserPage={false} />
				{!loading && (
					<div className="my-6">
						<InfoMessage message="Não há mais posts para mostrar." />
					</div>
				)}
			</div>
		</ScrollPagination>
	);
}
