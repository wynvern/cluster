import type User from "@/lib/db/user/type";
import prettyDate from "@/util/prettyDate";
import {
	ArrowTopRightOnSquareIcon,
	NoSymbolIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BanGroupMember from "../modal/BanGroupMember";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import { useSession } from "next-auth/react";

export default function UserPopover({
	user,
	groupname,
}: {
	user: {
		id: string;
		username: string | null;
		name: string | null;
		bio: string | null;
		groups: { group: { members: { joinedAt: Date }[] } }[];
	};
	groupname: string;
}) {
	const { confirm } = useConfirmationModal();
	const [hasGroupModeration, setHasGroupModeration] = useState(false);
	const [activeBanMember, setActiveBanMember] = useState(false);
	const session = useSession();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function checkGroupModeration() {
			if (!session.data?.user) return false;

			const permission = await memberHasPermission(
				session.data.user.id,
				groupname,
				"moderator"
			);
			setHasGroupModeration(permission);
		}

		checkGroupModeration();
	}, []);

	async function handleBanMember() {
		setActiveBanMember(true);
	}

	// TODO: Check if the user being banned is not important, such as owner or moderator

	return (
		<>
			<div className="w-[300px] p-3 flex flex-col gap-y-1">
				<Link
					href={`/user/${user.username}`}
					className="flex items-center gap-x-2"
				>
					<b>{user.name}</b>
					<p className="text-neutral-500">u/{user.username}</p>
					<ArrowTopRightOnSquareIcon className="h-4" />
				</Link>
				<p>{user.bio}</p>
				<p>
					Membro desde{" "}
					{prettyDate({
						date: user.groups[0].group.members[0].joinedAt,
					})}
				</p>
				{hasGroupModeration && (
					<div className="mt-3 flex gap-x-2">
						<Button
							color="danger"
							startContent={<NoSymbolIcon className="h-6" />}
							onClick={handleBanMember}
						>
							Banir
						</Button>
						<Button
							startContent={<XMarkIcon className="h-6" />}
							variant="bordered"
						>
							Remover
						</Button>
					</div>
				)}
			</div>

			<BanGroupMember
				groupname={groupname}
				userId={user.id}
				active={activeBanMember}
				setActive={setActiveBanMember}
			/>
		</>
	);
}
