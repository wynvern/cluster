import NoPosts from "@/components/card/NoPosts";
import GroupHeader from "./GroupHeader";
import fetchGroup from "@/lib/db/group/group";
import GroupProfile from "./GroupProfile";
import GroupContent from "./GroupContent";

interface GroupPageProps {
	params: {
		groupname: string;
	};
}

export default async function GroupPage({
	params: { groupname },
}: GroupPageProps) {
	const groupData = await fetchGroup({ groupname });

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<GroupHeader group={groupData} />
				{groupData ? (
					<>
						<GroupProfile group={groupData} />
						<GroupContent group={groupData} />
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<NoPosts message="Usuário não encontrado." />
					</div>
				)}
			</div>
		</div>
	);
}
