import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, Image, Skeleton } from "@nextui-org/react";
import type Group from "@/lib/db/group/type";
import GroupDropdown from "./GroupDropdown";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FollowUnfollowGroup from "@/components/general/FollowUnfollowGroup";

export default function GroupDisplay({ group }: { group: Group | null }) {
	const router = useRouter();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (group !== null) setLoaded(true);
	}, [group]);

	return (
		<div className="w-full">
			<div
				className={`w-full relative ${group ? "bg-neutral-800" : ""}`}
				style={{ aspectRatio: "1000 / 400" }}
			>
				<Skeleton className="absolute w-full h-full" isLoaded={loaded}>
					<Image
						className="absolute w-full h-full rounded-none object-cover z-1"
						src={(group?.banner as string) || ""}
						removeWrapper={true}
					/>
				</Skeleton>
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
					<Skeleton isLoaded={loaded} className="rounded-large">
						<Image
							src={group?.image || "/brand/default-avatar.svg"}
							removeWrapper={true}
							className="h-[150px] sm:h-60 w-auto object-cover"
						/>
					</Skeleton>
				</div>
			</div>
			<div className="w-full px-4 sm:px-10 flex flex-col gap-y-4">
				<div className="w-full h-20 flex items-center justify-end gap-x-4">
					{group && (
						<FollowUnfollowGroup groupname={group.groupname} />
					)}
					{group && <GroupDropdown defaultGroup={group} />}
				</div>
				<div>
					<Skeleton isLoaded={loaded} className="rounded-large">
						<h1>{group?.name || "loading"}</h1>
						<p>
							<b>g/</b>
							{group?.groupname || "loading"}
						</p>
					</Skeleton>
				</div>
				<div>
					<Skeleton isLoaded={loaded} className="rounded-large">
						<p>{group?.description || "loading"}</p>
					</Skeleton>
				</div>
			</div>
		</div>
	);
}
