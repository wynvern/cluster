"use client";

import NoPosts from "@/components/card/NoPosts";
import ScrollPagination from "@/components/general/ScrollPagination";
import GroupList from "@/components/group/GroupList";
import PostsList from "@/components/post/PostsList";
import type { GroupCard } from "@/lib/db/group/type";
import { fetchUserBookmarks, fetchUserPosts } from "@/lib/db/post/post";
import type Post from "@/lib/db/post/type";
import type User from "@/lib/db/user/type";
import { Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";

interface UserTabsProps {
	initialBookmarks: Post[] | null | string;
	initialPosts: Post[] | null;
	initialGroups: GroupCard[] | null | string;
	user: User;
}

function UserPostsTab({
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
			<PostsList posts={posts} />
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

function UserBookmarksTab({
	user,
	initialBookmarks,
}: {
	user: User;
	initialBookmarks: Post[] | null | string;
}) {
	if (typeof initialBookmarks === "string") {
		return (
			<div className="my-6">
				<NoPosts message="Os salvos desse usuário são privados." />
			</div>
		);
	}

	const [posts, setPosts] = useState<Post[] | null>(initialBookmarks);
	const [loading, setLoading] = useState(false);
	const [noMoreData, setNoMoreData] = useState(false);

	async function fetchMorePosts(skip: number, take: number) {
		setLoading(true);
		const data = await fetchUserBookmarks(user.id, { skip, take });
		if (typeof data === "string") return;

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
			<PostsList posts={posts} />
			{noMoreData && initialBookmarks && initialBookmarks.length >= 1 && (
				<div className="mt-4 py-6">
					<NoPosts message="Fim dos posts salvos." />
				</div>
			)}
			{initialBookmarks?.length === 0 && (
				<div className="mt-4 py-6">
					<NoPosts message="O usuário não tem nada salvo." />
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
	const [groups, setGroups] = useState<GroupCard[] | null | string>(
		initialGroups
	);

	return (
		//  @ts-ignore
		<Tabs
			variant="underlined"
			className="w-full bottom-border flex items-center justify-center"
		>
			<Tab title={<h3 className="p-2">Posts</h3>} className="px-0 w-full">
				<UserPostsTab initialPosts={initialPosts} user={user} />
			</Tab>
			<Tab
				title={<h3 className="p-2">Salvos</h3>}
				className="px-0 w-full"
			>
				<UserBookmarksTab
					user={user}
					initialBookmarks={initialBookmarks}
				/>
			</Tab>
			<Tab
				title={<h3 className="p-2">Grupos</h3>}
				className="px-0 w-full"
			>
				{typeof groups === "string" ? (
					<div className="my-6">
						<NoPosts message="Os grupos que o usuário participa são privados." />
					</div>
				) : (
					<GroupList
						groups={groups}
						noGroups="O usuário não está em nenhum grupo"
					/>
				)}
			</Tab>
		</Tabs>
	);
}
