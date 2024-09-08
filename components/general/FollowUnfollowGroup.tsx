import { fetchGroupSettings } from "@/lib/db/group/groupManagement";
import { getMemberRole } from "@/lib/db/group/groupMember";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import { enterGroup, exitGroup } from "@/lib/db/user/user";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import type React from "react";
import { useEffect, useState } from "react";

export default function ({
	groupname,
	isDefaultFollowing,
}: {
	groupname: string;
	isDefaultFollowing: boolean;
}) {
	const [isFollowing, setIsFollowing] = useState(isDefaultFollowing);
	const [isJoiningDisabled, setIsJoiningDisabled] = useState(false);
	const [userRole, setUserRole] = useState<string | null>(null);
	const session = useSession();

	// TODO: Optimize
	useEffect(() => {
		async function checkFollowingStatus() {
			if (!session.data) return false;

			const userRole = await getMemberRole({ groupname });
			const role = await memberHasPermission(
				session.data.user.id,
				groupname,
				"member"
			);
			const settings = await fetchGroupSettings({ groupname });

			setUserRole(userRole);
			setIsFollowing(role);
			setIsJoiningDisabled(!settings?.memberJoining);
		}

		checkFollowingStatus();
	}, [session.data, groupname]);

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (isFollowing) {
			await exitGroup({ groupname });
			setIsFollowing(false);

			// Hide create post button
			const divToHide = document.getElementById("create-post-button");
			if (divToHide) {
				divToHide.style.display = "none";
			}
		} else {
			await enterGroup({ groupname });
			setIsFollowing(true);

			// Show create post button
			const divToShow = document.getElementById("create-post-button");
			if (divToShow) {
				divToShow.style.display = "flex";
			}
		}
	};

	return (
		<Button
			size="sm"
			variant={isFollowing ? "bordered" : "solid"}
			color="primary"
			onClick={(e) => {
				e.stopPropagation();
				handleClick(e);
			}}
			isDisabled={
				userRole === "owner" || (isJoiningDisabled && !isFollowing)
			}
		>
			{isFollowing ? "Seguindo" : "Seguir"}
		</Button>
	);
}
