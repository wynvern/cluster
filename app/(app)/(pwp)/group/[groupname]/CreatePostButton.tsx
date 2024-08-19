"use client";

import CreatePost from "@/components/modal/CreatePost";
import type Group from "@/lib/db/group/type";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function CreatePostButton({
	group,
	isUserMember,
}: {
	group: Group;
	isUserMember: boolean;
}) {
	const [createPostActive, setCreatePostActive] = useState(false);

	return (
		<>
			<Button
				id="create-post-button"
				className="fixed bottom-20 right-8 sm:right-10 z-50 sm:bottom-10"
				isIconOnly={true}
				size="lg"
				color="primary"
				style={{ display: isUserMember ? "flex" : "none" }}
				onClick={() => setCreatePostActive(true)}
			>
				<PlusIcon className="h-6" />
			</Button>
			<CreatePost
				active={createPostActive}
				setActive={setCreatePostActive}
				group={group}
			/>
		</>
	);
}
