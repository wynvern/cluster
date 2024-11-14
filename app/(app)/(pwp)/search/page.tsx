"use client";

import InfoMessage from "@/components/card/InfoMessage";
import PostCard from "@/components/card/PostCard";
import GroupCard from "@/components/group/GroupCard";
import type Group from "@/lib/db/group/type";
import { CircularProgress } from "@nextui-org/progress";
import type Post from "@/lib/db/post/type";
import { searchGroup, searchPost, searchUser } from "@/lib/db/search/Search";
import type User from "@/lib/db/user/type";
import { Image, Input, Tab, Tabs, user } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

let searchString = "";

export default function SearchPage() {
	const [isSearching, setIsSearching] = useState(false);
	const [results, setResults] = useState<{
		groups: Group[];
		users: User[];
		posts: Post[];
	}>({
		groups: [],
		users: [],
		posts: [],
	});
	const [notFound, setNotFound] = useState<{
		user?: boolean;
		group?: boolean;
		post?: boolean;
	}>({});
	const [activeTab, setActiveTab] = useState("post");

	async function handleSearch(searchParam: string) {
		setIsSearching(true);

		switch (activeTab) {
			case "user":
				await searchUsers(searchParam);
				break;
			case "group":
				await searchGroups(searchParam);
				break;

			case "post":
				await searchPosts(searchParam);
				break;
		}

		setIsSearching(false);
	}

	async function searchUsers(searchParam: string) {
		setResults((prev) => ({ ...prev, users: [] }));
		const users = await searchUser(searchParam);

		if (typeof users === "string") {
			if (users === "no-users")
				setNotFound((prev) => ({ ...prev, user: true }));

			return;
		}

		setNotFound((prev) => ({ ...prev, user: false }));
		setResults((prev) => ({ ...prev, users }));
	}

	async function searchGroups(searchParam: string) {
		setResults((prev) => ({ ...prev, groups: [] }));
		const groups = await searchGroup(searchParam);

		if (typeof groups === "string") {
			if (groups === "no-groups")
				setNotFound((prev) => ({ ...prev, group: true }));

			return;
		}
		setNotFound((prev) => ({ ...prev, group: false }));
		setResults((prev) => ({ ...prev, groups }));
	}

	async function searchPosts(searchParam: string) {
		setResults((prev) => ({ ...prev, posts: [] }));
		const posts = await searchPost(searchParam);

		if (typeof posts === "string") {
			alert("no posts");

			if (posts === "no-posts")
				setNotFound((prev) => ({ ...prev, post: true }));
			return;
		}

		if (posts.length === 0) {
			setNotFound((prev) => ({ ...prev, post: true }));
			return;
		}

		setNotFound((prev) => ({ ...prev, post: false }));
		setResults((prev) => ({ ...prev, posts }));
	}

	const makeSearch = useCallback(
		_.throttle(() => handleSearch(searchString), 1000),
		[],
	);

	// Esta porra faz com que a função de fazer fetch das coisas rode quando o hook das tabs muda fds
	useEffect(() => {
		handleSearch(searchString);
	}, [activeTab]);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[100vw] sm:max-w-[1000px] h-full relative pt-10">
				<div className="px-4 sm:px-10 pb-4">
					<Input
						variant="bordered"
						placeholder="Pesquisar"
						startContent={<MagnifyingGlassIcon className="h-6" />}
						onValueChange={(e: string) => {
							searchString = e;

							if (searchString.length === 0) {
								setResults({
									groups: [],
									users: [],
									posts: [],
								});
								setNotFound({
									user: false,
									group: false,
									post: false,
								});
							} else {
								makeSearch();
							}
						}}
					/>
				</div>
				{/* @ts-ignore */}
				<Tabs
					variant="underlined"
					className="w-full bottom-border flex items-center justify-center"
					onSelectionChange={(e: any) => {
						setActiveTab(["post", "group", "user"][e.split(".")[1]]);
					}}
				>
					<Tab title={<h3 className="p-2">Posts</h3>} className="px-0 w-full">
						<div className="">
							{notFound.post && !isSearching && (
								<div className="mt-6">
									<InfoMessage message="Nenhum post encontrado." />
								</div>
							)}
							<div>
								{results.posts.map((post) => (
									<div key={post.id} className="bottom-border px-4 mt-6 pb-6">
										<PostCard post={post} />
									</div>
								))}
							</div>

							{isSearching && (
								<div>
									{/* @ts-ignore */}
									<CircularProgress size="lg" />
								</div>
							)}
						</div>
					</Tab>
					<Tab title={<h3 className="p-2">Grupos</h3>} className="px-0 w-full">
						<div className="">
							{notFound.group && !isSearching && (
								<div className="mt-6">
									<InfoMessage message="Nenhum grupo encontrado." />
								</div>
							)}

							{/* Grid container for cards */}
							<div className="grid grid-cols-2 gap-4">
								{results.groups.map((group) => (
									<div
										className="px-4 sm:px-10 w-full flex items-center py-4"
										key={group.id}
									>
										<GroupCard group={group} />
									</div>
								))}
							</div>

							{isSearching && (
								<div>
									{/* @ts-ignore */}
									<CircularProgress size="lg" />
								</div>
							)}
						</div>
					</Tab>
					<Tab
						title={<h3 className="p-2">Usuários</h3>}
						className="px-0 w-full"
					>
						<div className="">
							{notFound.user && !isSearching && (
								<div className="mt-6">
									<InfoMessage message="Nenhum usuário encontrado." />
								</div>
							)}

							{results.users.map((user) => (
								<Link href={`/user/${user.username}`} key={user.id}>
									<div className="px-4 sm:px-10 w-full bottom-border flex items-center py-4 gap-x-4">
										<Image
											src={
												user.image
													? `${user.image}?size=100`
													: "/brand/default-avatar.svg"
											}
											alt={user.username || ""}
											removeWrapper={true}
											className="h-14 w-14"
										/>
										<div>
											<h2>{user.name}</h2>
											<p>{user.username}</p>
											<p>{user.bio}</p>
										</div>
									</div>
								</Link>
							))}

							{isSearching && (
								<div>
									{/* @ts-ignore */}
									<CircularProgress size="lg" />
								</div>
							)}
						</div>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
