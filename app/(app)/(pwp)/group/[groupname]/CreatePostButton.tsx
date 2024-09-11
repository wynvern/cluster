"use client";

import CreatePost from "@/components/modal/CreatePost";
import type Group from "@/lib/db/group/type";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Tooltip } from "@nextui-org/react";
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
			<Tooltip content="Criar postagem" placement="left">
				<Button
					id="create-post-button"
					className="fixed right-10 z-50 bottom-10"
					isIconOnly={true}
					size="lg"
					color="primary"
					style={{ display: isUserMember ? "flex" : "none" }}
					onClick={() => setCreatePostActive(true)}
				>
					<PlusIcon className="h-6" />
				</Button>
			</Tooltip>
			<CreatePost
				active={createPostActive}
				setActive={setCreatePostActive}
				group={group}
			/>
		</>
	);
}
