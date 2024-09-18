"use client";

import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import type Group from "@/lib/db/group/type";
import CustomizeGroup from "@/components/modal/CustomizeGroup";
import ReportGroup from "@/components/modal/ReportGroup";
import FollowUnfollowGroup from "@/components/general/FollowUnfollowGroup";
import { useRouter } from "next/navigation";
import ModeratorGroupActions from "./_actions/ModeratorsGroupActions";
import UserGroupActions from "./_actions/UserGroupActions";

export default function GroupActions({
	group,
	isModerator,
}: {
	group: Group;
	isModerator: boolean;
}) {
	const [customizeGroup, setCustomizeGroupActive] = useState(false);
	const [reportGroup, setReportGroup] = useState(false);
	const router = useRouter();

	return (
		<>
			<Link
				href={`/chat/${group.groupname}`}
				style={{ display: group.isUserMember ? "flex" : "none" }}
			>
				<Button
					isIconOnly={true}
					color="primary"
					size="sm"
					id="enter-group-chat-button"
				>
					<ChatBubbleBottomCenterTextIcon className="h-6" />
				</Button>
			</Link>
			<FollowUnfollowGroup
				groupname={group.groupname}
				isDefaultFollowing={group.isUserMember || false}
			/>
			{isModerator ? (
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
