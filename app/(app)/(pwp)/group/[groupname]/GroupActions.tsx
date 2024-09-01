"use client";

import {
	ChatBubbleBottomCenterTextIcon,
	Cog6ToothIcon,
	EllipsisHorizontalIcon,
	FlagIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownTrigger,
	DropdownItem,
	Button,
	Link,
	DropdownMenu,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import type Group from "@/lib/db/group/type";
import CustomizeGroup from "@/components/modal/CustomizeGroup";
import ReportGroup from "@/components/modal/ReportGroup";
import FollowUnfollowGroup from "@/components/general/FollowUnfollowGroup";
import { useRouter } from "next/navigation";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import { useSession } from "next-auth/react";
import ModeratorGroupActions from "./_actions/ModeratorsGroupActions";
import UserGroupActions from "./_actions/UserGroupActions";

export default function GroupActions({ group }: { group: Group }) {
	const [customizeGroup, setCustomizeGroupActive] = useState(false);
	const [reportGroup, setReportGroup] = useState(false);
	const [hasGroupPermission, setHasGroupPermission] = useState(false);
	const router = useRouter();
	const session = useSession();
	const dropdownItems = [
		{
			modRequired: true,
			description: "Customize o grupo",
			icon: <PencilIcon className="h-8" aria-label="Sign Out" />,
			ariaLabel: "customize group",
			onClick: () => setCustomizeGroupActive(true),
			text: "Customizar Perfil",
		},
		{
			modRequired: true,
			description: "Gerenciar o grupo",
			icon: (
				<Cog6ToothIcon className="h-8" aria-label="gerenciar-grupo" />
			),
			ariaLabel: "manage group",
			onClick: () => router.push(`/group/${group.groupname}/manage`),
			text: "Gerenciar Grupo",
		},
		{
			modRequired: false,
			description: "Reportar grupo",
			icon: <FlagIcon className="h-8" aria-label="Sign Out" />,
			ariaLabel: "report group",
			onClick: () => setReportGroup(true),
			text: "Reportar Grupo",
			className: "text-danger",
		},
	];

	useEffect(() => {
		const handleHasPermission = async () => {
			if (!session.data?.user.username) return;
			const permission = await memberHasPermission(
				session.data.user.id,
				group.groupname,
				"moderator"
			);
			setHasGroupPermission(permission);
		};
		handleHasPermission();
	}, [group.groupname, session.data?.user]);

	return (
		<>
			<Link href={`/chat/${group.groupname}`}>
				<Button isIconOnly={true} color="primary" size="sm">
					<ChatBubbleBottomCenterTextIcon className="h-6" />
				</Button>
			</Link>
			<FollowUnfollowGroup
				groupname={group.groupname}
				isDefaultFollowing={group.isUserMember || false}
			/>
			{hasGroupPermission ? (
				<ModeratorGroupActions
					setCustomizeGroupActive={setCustomizeGroupActive}
					router={router}
					group={group}
				/>
			) : (
				<UserGroupActions setReportGroup={setReportGroup} />
			)}

			<CustomizeGroup
				group={group}
				active={customizeGroup}
				setActive={() => setCustomizeGroupActive(false)}
			/>
			<ReportGroup
				groupname={group.groupname}
				active={reportGroup}
				setActive={() => setReportGroup(false)}
			/>
		</>
	);
}
