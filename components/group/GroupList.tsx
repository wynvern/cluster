import type { GroupCard as GroupCardType } from "@/lib/db/group/type";
import GroupCard from "./GroupCard";
import NoPosts from "../card/NoPosts";

export default function GroupList({
	groups,
	noGroups,
}: {
	groups: GroupCardType[] | null;
	noGroups: string;
}) {
	return (
		// TODO: Transform into a grid
		<div className="w-full px-4 sm:px-10 mt-6">
			{Array.isArray(groups) && (
				<div className="grid sm:grid-cols-1 sm:grid-cols-2 gap-4 justify-center sm:flex">
					{groups.map((group) => (
						<div className="w-full md:w-auto" key={group.id}>
							<GroupCard group={group} />
						</div>
					))}
				</div>
			)}
			{groups && groups.length === 0 && (
				<div className="mt-16">
					<NoPosts message={noGroups} />
				</div>
			)}
		</div>
	);
}
