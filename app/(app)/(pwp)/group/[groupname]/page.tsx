"use client";

import { useEffect, useState } from "react";
import TabContent from "./TabContent";
import fetchGroup from "@/lib/db/group/group";
import type Group from "@/lib/db/group/type";
import GroupDisplay from "./GroupDisplay";
import { Button } from "@nextui-org/react";
import CreatePost from "@/components/modal/CreatePost";

export default function GroupPage({
	params,
}: {
	params: { groupname: string };
}) {
	const [notFound, setNotFound] = useState(false);
	const [group, setGroup] = useState<Group | null>(null);
	const [createPostActive, setCreatePostActive] = useState(false);

	async function handleFetchGroup() {
		const data = await fetchGroup({ groupname: params.groupname });

		if (!data) {
			setNotFound(true);
			return false;
		}

		setGroup(data);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchGroup();
	}, []);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full">
				{notFound ? <>group was not found</> : ""}
				{group ? <GroupDisplay group={group} /> : ""}
				<TabContent />
				<div className="absolute bottom-0 right-0">
					<Button
						className="bg-blue-500 text-white p-2 rounded-md"
						onClick={() => setCreatePostActive(true)}
					>
						Create Post
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
