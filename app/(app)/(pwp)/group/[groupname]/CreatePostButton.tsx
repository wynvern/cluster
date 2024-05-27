"use client";

import CreatePost from "@/components/modal/CreatePost";
import { fetchGroupSettings, getRole } from "@/lib/db/group/group";
import type Group from "@/lib/db/group/type";
import hasPermission from "@/util/hasPermission";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function CreatePostButton({ group }: { group: Group }) {
	const [createPostActive, setCreatePostActive] = useState(false);
	const [hasPostPermission, setHasPostPermission] = useState(false);

	useEffect(() => {
		async function checkPermission() {
			const role = await getRole({ groupname: group.groupname });
			switch (role) {
				case "owner":
					setHasPostPermission(true);
					break;
				case "moderator":
					setHasPostPermission(true);
					break;
				case "member": {
					const settings = await fetchGroupSettings({
						groupname: group.groupname,
					});
					if (settings?.memberPosting) {
						setHasPostPermission(true);
					} else {
						setHasPostPermission(false);
					}
					break;
				}
				default:
					setHasPostPermission(false);
					break;
			}
		}

		checkPermission();
	}, [group.groupname]); // add the dependencies here

	if (!hasPostPermission) return null;

	return (
		<>
			<Button
				className="fixed bottom-20 right-8 sm:right-10 z-50 sm:bottom-10"
				isIconOnly={true}
				size="lg"
				color="primary"
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
