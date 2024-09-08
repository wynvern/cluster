import InfoMessage from "@/components/card/InfoMessage";
import GroupProfile from "./GroupProfile";
import GroupContent from "./GroupContent";
import CreatePostButton from "./CreatePostButton";
import fetchGroup, { fetchGroupSettings } from "@/lib/db/group/groupManagement";
import { getMemberRole } from "@/lib/db/group/groupMember";
import PageHeader from "@/components/general/PageHeader";

interface GroupPageProps {
	params: {
		groupname: string;
	};
}

export default async function GroupPage({
	params: { groupname },
}: GroupPageProps) {
	const groupData = await fetchGroup({ groupname });
	const userRole = groupData
		? await getMemberRole({ groupname: groupData?.groupname })
		: null;
	const groupSettings = groupData
		? await fetchGroupSettings({ groupname: groupData.groupname })
		: null;

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<PageHeader
					showBackButton={true}
					title={`g/${groupData?.groupname}`}
					enableHeightUsage={false}
				/>
				{groupData ? (
					<>
						<GroupProfile group={groupData} />
						<GroupContent group={groupData} />
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<InfoMessage message="Grupo não encontrado." />
					</div>
				)}
			</div>

			{groupData &&
				(!groupSettings?.memberPosting && userRole
					? ["moderator", "owner"].includes(userRole)
					: true) && (
					<CreatePostButton
						group={groupData}
						isUserMember={!!userRole}
					/>
				)}
		</div>
	);
}
