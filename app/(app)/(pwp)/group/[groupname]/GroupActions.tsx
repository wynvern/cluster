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
	DropdownMenu,
	DropdownItem,
	Button,
	Link,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import type Group from "@/lib/db/group/type";
import CustomizeGroup from "@/components/modal/CustomizeGroup";
import ReportGroup from "@/components/modal/ReportGroup";
import FollowUnfollowGroup from "@/components/general/FollowUnfollowGroup";
import { useRouter } from "next/navigation";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import { useSession } from "next-auth/react";

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
				<Button isIconOnly={true} color="primary">
					<ChatBubbleBottomCenterTextIcon className="h-6" />
				</Button>
			</Link>
			<FollowUnfollowGroup
				groupname={group.groupname}
				isDefaultFollowing={group.isUserMember || false}
			/>
			<Dropdown
				className="default-border shadow-none"
				placement="bottom-end"
			>
				<DropdownTrigger>
					<Button isIconOnly={true} variant="bordered">
						<EllipsisHorizontalIcon className="h-8" />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="Static Actions">
					{dropdownItems
						.filter(
							(item) =>
								(item.modRequired && hasGroupPermission) ||
								(!item.modRequired && !hasGroupPermission)
						)
						.map((item) => (
							<DropdownItem
								key={item.ariaLabel}
								description={item.description}
								startContent={item.icon}
								aria-label={item.ariaLabel}
								onClick={item.onClick}
								className={item.className}
							>
								{item.text}
							</DropdownItem>
						))}
				</DropdownMenu>
			</Dropdown>

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
