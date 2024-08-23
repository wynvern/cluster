"use client";

import NoPosts from "@/components/card/NoPosts";
import PostCard from "@/components/card/PostCard";
import GroupCard from "@/components/group/GroupCard";
import type Group from "@/lib/db/group/type";
import type Post from "@/lib/db/post/type";
import { searchGroup, searchPost, searchUser } from "@/lib/db/search/Search";
import type User from "@/lib/db/user/type";
import {
	CircularProgress,
	Image,
	Input,
	Tab,
	Tabs,
	user,
} from "@nextui-org/react";
import { useState } from "react";

function debounce(func: any, wait: number) {
	let timeout: string | number | NodeJS.Timeout | undefined;

	return function executedFunction(...args: any[]) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

export default function SearchPage() {
	const [selectedCat, setSelectedCat] = useState<
		"user" | "group" | "post" | "comment"
	>("user");
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

	async function handleSearch(searchParam: string) {
		const selectedKey = ["post", "group", "user", "comment"][
			Number.parseInt(selectedCat.split(".")[1])
		];

		setIsSearching(true);

		switch (selectedKey) {
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

		console.log(selectedCat);

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

		setNotFound((prev) => ({ ...prev, post: false }));
		setResults((prev) => ({ ...prev, posts }));
	}

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[100vw] sm:max-w-[1000px] h-full relative pt-10">
				<div className="px-4 sm:px-10 pb-4">
					<Input
						placeholder="Pesquisar"
						onChange={(e: any) => {
							debounce(handleSearch(e.target.value), 1000);
						}}
					/>
				</div>
				{/* @ts-ignore */}
				<Tabs
					variant="underlined"
					className="w-full bottom-border flex items-center justify-center"
					selectedKey={selectedCat}
					onSelectionChange={(key: any) => {
						setSelectedCat(
							key as "user" | "group" | "post" | "comment"
						);
					}}
				>
					<Tab
						title={<h3 className="p-2">Posts</h3>}
						className="px-0 w-full"
					>
						<div className="">
							{notFound.post && (
								<div>
									<NoPosts message="Nenhum post encontrado." />
								</div>
							)}
							<div>
								{results.posts.map((post) => (
									<div
										key={post.id}
										className="bottom-border px-4 mt-6"
									>
										<PostCard post={post} />
									</div>
								))}
							</div>

							{isSearching && (
								<div>
									<CircularProgress size="lg" />
								</div>
							)}
						</div>
					</Tab>
					<Tab
						title={<h3 className="p-2">Grupos</h3>}
						className="px-0 w-full"
					>
						<div className="">
							{notFound.group && (
								<div>
									<NoPosts message="Nenhum grupo encontrado." />
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
							{notFound.user && (
								<div>
									<NoPosts message="Nenhum usuário encontrado." />
								</div>
							)}

							{results.users.map((user) => (
								<div
									className="px-4 sm:px-10 w-full bottom-border flex items-center py-4 gap-x-4"
									key={user.id}
								>
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
							))}

							{isSearching && (
								<div>
									<CircularProgress size="lg" />
								</div>
							)}
						</div>
					</Tab>
					<Tab
						title={<h3 className="p-2">Comentários</h3>}
						className="px-0 w-full"
					></Tab>
				</Tabs>
			</div>
		</div>
	);
}
