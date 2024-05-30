import { Chip, Image } from "@nextui-org/react";
import type Group from "@/lib/db/group/type";
import GroupActions from "./GroupActions";

export default async function GroupProfile({ group }: { group: Group }) {
	return (
		<div className="w-full">
			{/* Banner */}
			<div
				className={`w-full relative ${group ? "bg-neutral-800" : ""}`}
				style={{ aspectRatio: "1000 / 400" }}
			>
				<Image
					className="absolute w-full h-full rounded-none object-cover z-1 max-w-[1000px] max-h-[400px]"
					src={group ? (group.banner as string) : ""}
					removeWrapper={true}
				/>
				<div className="absolute -bottom-20 left-4 sm:left-10">
					<Image
						src={
							group?.image
								? group.image
								: "/brand/default-group.svg"
						}
						removeWrapper={true}
						className="h-[150px] sm:h-60 object-cover aspect-square"
					/>
				</div>
			</div>

			{/* Information */}
			<div className="w-full px-4 sm:px-10 flex flex-col gap-y-4">
				<div className="w-full h-20 flex items-center justify-end gap-x-4">
					<GroupActions group={group} />
				</div>
				<div>
					<h1>{group.name}</h1>
					<p>
						<b>g/</b>
						{group.groupname}
					</p>
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
			<div className="bottom-border w-full mt-10" />
		</div>
	);
}
