import type { GroupCard as GroupCardType } from "@/lib/db/group/type";
import GroupCard from "./GroupCard";
import NoPosts from "../card/NoPosts";

export default function GroupList({
	groups,
}: {
	groups: GroupCardType[] | null;
}) {
	return (
		// TODO: Transform into a grid
		<div className="flex flex-col items-center">
			{groups && (
				<>
					{groups.map((group) => {
						return <GroupCard key={group.id} group={group} />;
					})}
				</>
			)}
			{groups && groups.length === 0 && (
				<div className="mt-16">
					<NoPosts message="O usuário não participa de nenhum grupo." />
				</div>
			)}
		</div>
	);
}
