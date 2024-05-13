import type { GroupCard as GroupCardType } from "@/lib/db/group/type";

import { Button, Chip, Image, Link, ScrollShadow } from "@nextui-org/react";
import FollowUnfollowGroup from "../general/FollowUnfollowGroup";

export default function GroupCard({ group }: { group: GroupCardType }) {
	return (
		<Link href={`/group/${group.groupname}`}>
			<div className="rounded-large border-default w-full w-[400px] mb-4">
				<div className="relative">
					<Image
						src={group.banner || ""}
						removeWrapper={true}
						className="w-full object-cover rounded-b-none"
						style={{ aspectRatio: "400 / 160" }}
					/>
					<Image
						removeWrapper={true}
						src={group.image || "/brand/default-group.svg"}
						className="w-[100px] h-[100px] absolute top-[90px] left-4"
					/>
				</div>
				<div className="h-10 w-full px-4 py-4 flex justify-between">
					<div />
					<FollowUnfollowGroup groupname={group.groupname} />
				</div>
				<div className="w-full h-20 px-4">
					<h2>{group.name}</h2>
					<p>g/{group.groupname}</p>
				</div>
			</div>
		</Link>
	);
}
