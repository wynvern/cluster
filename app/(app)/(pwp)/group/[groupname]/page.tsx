"use client";

import { useEffect, useState } from "react";
import TabContent from "./TabContent";
import fetchGroup from "@/lib/db/group/group";
import type Group from "@/lib/db/group/type";
import GroupDisplay from "./GroupDisplay";
import { Button } from "@nextui-org/react";
import CreatePost from "@/components/modal/CreatePost";
import type Post from "@/lib/db/post/type";
import { fetchGroupPosts } from "@/lib/db/post/post";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function GroupPage({
	params,
}: {
	params: { groupname: string };
}) {
	const [notFound, setNotFound] = useState(false);
	const [group, setGroup] = useState<Group | null>(null);
	const [createPostActive, setCreatePostActive] = useState(false);
	const [posts, setPosts] = useState<Post[]>([]);

	async function handleFetchGroup() {
		const data = await fetchGroup({ groupname: params.groupname });

		if (!data) {
			setNotFound(true);
			return false;
		}

		setGroup(data);
	}

	async function handleFetchPosts() {
		if (!group) return;

		const data = await fetchGroupPosts(group.id);
		console.log(data);
		setPosts(data as Post[]);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchGroup();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchPosts();
	}, [group]);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full">
				{notFound ? <>group was not found</> : ""}
				<GroupDisplay group={group} />
				<TabContent posts={posts} />
				<div className="fixed bottom-20 sm:bottom-10 right-6 sm:bottom-10 z-50">
					<Button
						isIconOnly={true}
						size="lg"
						color="secondary"
						className="default-border"
						onClick={() => setCreatePostActive(true)}
					>
						<PlusIcon className="h-8" />
					</Button>
				</div>
			</div>

			{group ? (
				<CreatePost
					group={group}
					active={createPostActive}
					setActive={setCreatePostActive}
				/>
			) : (
				""
			)}
		</div>
	);
}
