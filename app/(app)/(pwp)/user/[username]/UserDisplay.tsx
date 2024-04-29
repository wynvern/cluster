import type User from "@/lib/db/user/type";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, Image, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import UserDropdown from "./UserDropdown";
import { useEffect, useState } from "react";

export default function UserDisplay({ user }: { user: User | null }) {
	const router = useRouter();
	const [loaded, setLoaded] = useState(false);
	console.log(user);

	useEffect(() => {
		if (user !== null) setLoaded(true);
	}, [user]);

	return (
		<div className="w-full">
			<div
				className="w-full relative"
				style={{ aspectRatio: "1000 / 400" }}
			>
				<Skeleton isLoaded={loaded} className="absolute w-full h-full">
					<Image
						className="absolute w-full h-full rounded-none object-cover z-1"
						src={user ? (user.banner as string) : ""}
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
					<Skeleton isLoaded={loaded} className="rounded-lg">
						<Image
							src={
								user?.image
									? user.image
									: "/brand/default-avatar.svg"
							}
							removeWrapper={true}
							className="h-[150px] sm:h-60 w-auto object-cover"
						/>
					</Skeleton>
				</div>
			</div>
			<div className="w-full px-4 sm:px-10 flex flex-col gap-y-4">
				<div className="w-full h-20 flex items-center justify-end">
					<Skeleton isLoaded={loaded} className="rounded-lg">
						{user ? <UserDropdown defaultUser={user} /> : ""}
					</Skeleton>
				</div>
				<div>
					<Skeleton isLoaded={loaded} className="rounded-lg">
						<h1>{user?.name || "loading"}</h1>
					</Skeleton>
					<Skeleton isLoaded={loaded} className="rounded-lg">
						<p>@{user?.username || "loading"}</p>
					</Skeleton>
				</div>
				<div>
					<Skeleton isLoaded={loaded} className="rounded-lg">
						<p>{user?.bio || "loading"}</p>
					</Skeleton>
				</div>
			</div>
		</div>
	);
}
