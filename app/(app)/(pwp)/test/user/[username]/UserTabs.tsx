"use client";

import NoPosts from "@/components/card/NoPosts";
import ScrollPagination from "@/components/general/ScrollPagination";
import GroupList from "@/components/group/GroupList";
import PostsList from "@/components/post/PostsList";
import type { GroupCard } from "@/lib/db/group/type";
import { fetchUserPosts } from "@/lib/db/post/post";
import type Post from "@/lib/db/post/type";
import type User from "@/lib/db/user/type";
import { Tabs, Tab } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface UserTabsProps {
	initialBookmarks: Post[] | null;
	initialPosts: Post[] | null;
	initialGroups: GroupCard[] | null;
	user: User;
}

function UserPostsTabs({
	user,
	initialPosts,
}: {
	user: User;
	initialPosts: Post[] | null;
}) {
	const [posts, setPosts] = useState<Post[] | null>(initialPosts);
	const [loading, setLoading] = useState(false);
	const [noMoreData, setNoMoreData] = useState(false);

	async function fetchMorePosts(skip: number, take: number) {
		setLoading(true);
		const data = await fetchUserPosts(user.id, { skip, take });
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
			<PostsList posts={posts} noPosts="O usuário não tem posts" />
			{noMoreData && initialPosts && initialPosts.length >= 1 && (
				<div className="mt-4 py-6">
					<NoPosts message="Fim dos posts." />
				</div>
			)}
			{initialPosts?.length === 0 && (
				<div className="mt-4 py-6">
					<NoPosts message="O usuário não tem nenhum post." />
				</div>
			)}
		</ScrollPagination>
	);
}

export default function UserTabs({
	initialBookmarks,
	initialPosts,
	initialGroups,
	user,
}: UserTabsProps) {
	const [bookmarks, setBookmarks] = useState<Post[] | null>(initialBookmarks);
	const [groups, setGroups] = useState<GroupCard[] | null>(initialGroups);

	return (
		<Tabs
			variant="underlined"
			className="w-full bottom-border flex items-center justify-center"
		>
			<Tab title={<h3 className="p-2">Posts</h3>} className="px-0 w-full">
				<UserPostsTabs initialPosts={initialPosts} user={user} />
			</Tab>
			<Tab
				title={<h3 className="p-2">Salvos</h3>}
				className="px-0 w-full"
			>
				<PostsList
					posts={bookmarks}
					noPosts="O usuário não tem posts salvos"
				/>
			</Tab>
			<Tab
				title={<h3 className="p-2">Grupos</h3>}
				className="px-0 w-full"
			>
				<GroupList
					groups={groups}
					noGroups="O usuário não está em nenhum grupo"
				/>
			</Tab>
		</Tabs>
	);
}
