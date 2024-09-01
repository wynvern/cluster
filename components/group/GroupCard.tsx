"use client";

import type { GroupCard as GroupCardType } from "@/lib/db/group/type";

import { Image, Link } from "@nextui-org/react";
import FollowUnfollowGroup from "../general/FollowUnfollowGroup";

export default function GroupCard({ group }: { group: GroupCardType }) {
	return (
		<Link
			href={`/group/${group.groupname}`}
			className="sm:w-[400px] sm:min-w-[400px] w-[300px] min-w-[300px]"
		>
			<div className="rounded-large border-default w-full mb-4">
				<div className="relative bg-neutral-800 rounded-large rounded-b-none">
					<Image
						src={group.banner || ""}
						removeWrapper={true}
						className="w-full object-cover rounded-b-none"
						style={{ aspectRatio: "400 / 160" }}
					/>
					<Image
						removeWrapper={true}
						src={group.image || "/brand/default-group.svg"}
						className="w-[100px] h-[100px] absolute sm:top-[90px] top-[50px] left-4"
					/>
				</div>
				<div className="h-10 w-full px-4 py-4 flex justify-between">
					<div />
					<FollowUnfollowGroup
						isDefaultFollowing={false}
						groupname={group.groupname}
					/>
				</div>
				<div className="w-full h-20 px-4">
					<h2>{group.name}</h2>
					<p>
						<b>g/</b>
						{group.groupname}
					</p>
				</div>
			</div>
		</Link>
	);
}
