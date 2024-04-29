import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, Image } from "@nextui-org/react";
import type Group from "@/lib/db/group/type";
import GroupDropdown from "./GroupDropdown";
import { useRouter } from "next/navigation";

export default function GroupDisplay({ group }: { group: Group }) {
	const router = useRouter();
	console.log(group);

	return (
		<div className="w-full">
			<div
				className="w-full bg-neutral-500 relative"
				style={{ aspectRatio: "1000 / 400" }}
			>
				<Image
					className="absolute w-full h-full rounded-none object-cover z-1"
					src={group.banner as string}
					removeWrapper={true}
				/>
				<div>
					<Button
						isIconOnly={true}
						color="secondary"
						className="ml-4 sm:ml-10 mt-4"
						onClick={() => router.back()}
					>
						<ArrowLeftIcon className="h-6" />
					</Button>
				</div>
				<div className="absolute -bottom-20 left-4 sm:left-10">
					<Image
						src={group.image || "/brand/default-avatar.svg"}
						removeWrapper={true}
						className="h-[150px] sm:h-60 w-auto object-cover"
					/>
				</div>
			</div>
			<div className="w-full px-4 sm:px-10 flex flex-col gap-y-4">
				<div className="w-full h-20 flex items-center justify-end">
					<GroupDropdown defaultGroup={group} />
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
			</div>
		</div>
	);
}
