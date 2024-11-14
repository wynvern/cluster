import { Chip } from "@nextui-org/react";
import type Group from "@/lib/db/group/type";
import GroupActions from "./GroupActions";
// @ts-ignore
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import RenderImages from "./RenderImages";

export default async function GroupProfile({ group }: { group: Group }) {
	const session = await getServerSession(authOptions);
	const isModerator = await memberHasPermission(
		session?.user.id || "",
		group.groupname,
		"moderator",
	);

	return (
		<div className="w-full">
			{/* Banner */}
			<div
				className={`w-full relative ${group ? "bg-neutral-800" : ""}`}
				style={{ aspectRatio: "1000 / 400" }}
			>
				<RenderImages group={group} />
			</div>

			{/* Information */}
			<div className="w-full px-4 sm:px-10 flex flex-col gap-y-2 sm:gap-y-4">
				<div className="w-full h-20 flex items-center justify-end gap-x-4">
					<GroupActions group={group} isModerator={isModerator} />
				</div>
				<div>
					<h1 style={{ lineHeight: "40px" }}>{group.name}</h1>
					<h3 className="second-foreground">
						<b>g/</b>
						{group.groupname}
					</h3>
				</div>
				<div>
					<p>{group.description}</p>
				</div>
				<div className="flex gap-x-2">
					<p>
						Posts <b>{group._count.posts}</b>
					</p>
					<p>
						Membros <b>{group._count.members}</b>
					</p>
				</div>
				<div className="flex gap-x-2">
					{group.categories.map((i) => (
						<Chip className="border-default bg-background" key={i}>
							<p>{i}</p>
						</Chip>
					))}
				</div>
			</div>
			<div className="bottom-border w-full mt-4" />
		</div>
	);
}
