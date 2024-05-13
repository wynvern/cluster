import { enterGroup, exitGroup, getRole } from "@/lib/db/group/group";
import { Button } from "@nextui-org/react";
import type React from "react";
import { useEffect, useState } from "react";

export default function ({ groupname }: { groupname: string }) {
	const [userRole, setUserRole] = useState<string | null | undefined>("");
	const [isLoading, setIsLoading] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		async function checkFollowingStatus() {
			const role = await getRole({ groupname });
			setUserRole(role);
			setIsLoading(false);
			setIsFollowing(
				["member", "owner", "moderator"].includes(String(role))
			);
		}

		checkFollowingStatus();
	}, [groupname]);

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (isFollowing) {
			await exitGroup({ groupname });
			setUserRole(undefined);
			setIsFollowing(false);
		} else {
			await enterGroup({ groupname });
			setUserRole("member");
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
			isDisabled={userRole === "owner"}
		>
			{isFollowing ? "Seguindo" : "Seguir"}
		</Button>
	);
}
