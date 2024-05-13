"use client";

import type User from "@/lib/db/user/type";
import fetchUser, { fetchUserGroups } from "@/lib/db/user/user";
import { useEffect, useState } from "react";
import UserDisplay from "./UserDisplay";
import TabContent from "./TabContent";
import type Post from "@/lib/db/post/type";
import { fetchUserBookmarkPosts, fetchUserPosts } from "@/lib/db/post/post";
import type { GroupCard } from "@/lib/db/group/type";

export default function UserPage({ params }: { params: { username: string } }) {
	const [notFound, setNotFound] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [bookmarkPosts, setBookmarkPosts] = useState<Post[] | null>(null);
	const [userGroups, setUserGroups] = useState<GroupCard[] | null>(null);

	async function handleFetchBookmarkPosts() {
		if (!user) return;

		const data = await fetchUserBookmarkPosts(user.id);

		setBookmarkPosts(data as Post[]);
	}

	async function handleFetchUser() {
		const data = await fetchUser({ username: params.username });

		if (!data) {
			setNotFound(true);
			return false;
		}

		setUser(data);
	}

	async function handleUserGroups() {
		if (!user) return;

		const data = await fetchUserGroups(user.id);
		setUserGroups(data as GroupCard[]);
	}

	async function handleFetchPosts() {
		if (!user) return;

		const data = await fetchUserPosts(user.id);

		setPosts(data as Post[]);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchUser();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchPosts();
		handleFetchBookmarkPosts();
		handleUserGroups();
	}, [user]);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full">
				{notFound ? <>User was not found</> : ""}
				<UserDisplay user={user} />
				<TabContent
					posts={posts}
					bookmarkPosts={bookmarkPosts}
					groups={userGroups}
				/>
			</div>
		</div>
	);
}
