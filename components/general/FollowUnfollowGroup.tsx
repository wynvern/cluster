import { fetchGroupSettings } from "@/lib/db/group/groupManagement";
import { getMemberRole } from "@/lib/db/group/groupMember";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import { enterGroup, exitGroup } from "@/lib/db/user/user";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import type React from "react";
import { useEffect, useState } from "react";

export default function ({ groupname }: { groupname: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isJoiningDisabled, setIsJoiningDisabled] = useState(false);
	const [userRole, setUserRole] = useState<string | null>(null);
	const session = useSession();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
