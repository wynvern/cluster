import {
	enterGroup,
	exitGroup,
	getRole,
	fetchGroupSettings,
} from "@/lib/db/group/group";
import hasPermission from "@/util/hasPermission";
import { Button } from "@nextui-org/react";
import type React from "react";
import { useEffect, useState } from "react";

export default function ({ groupname }: { groupname: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isJoiningDisabled, setIsJoiningDisabled] = useState(false);
	const [userRole, setUserRole] = useState<string | null>(null);

	useEffect(() => {
		async function checkFollowingStatus() {
			const userRole = await getRole({ groupname });
			setUserRole(userRole);

			const role = await hasPermission(groupname, "member");
			const settings = await fetchGroupSettings({ groupname });
			setIsLoading(false);
			setIsFollowing(role);
			setIsJoiningDisabled(!settings?.memberJoining);
		}

		checkFollowingStatus();
	}, [groupname]);

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (isFollowing) {
			await exitGroup({ groupname });
			setIsFollowing(false);
		} else {
			await enterGroup({ groupname });
			setIsFollowing(true);
		}
	};

	if (isLoading) {
		return <div />;
	}

	return (
		<Button
			variant={isFollowing ? "bordered" : "solid"}
			color="primary"
			onClick={handleClick}
			isDisabled={
				userRole === "owner" || (isJoiningDisabled && !isFollowing)
			}
		>
			{isFollowing ? "Seguindo" : "Seguir"}
		</Button>
	);
}
