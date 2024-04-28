import type User from "@/lib/db/user/type";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import UserDropdown from "./UserDropdown";

export default function UserDisplay({ user }: { user: User }) {
	const router = useRouter();

	return (
		<div className="w-full max-w-[1000px] h-full">
			<div className="w-full bg-neutral-500 h-full max-h-[350px] relative">
				<div>
					<Button
						isIconOnly={true}
						color="default"
						className="ml-10 mt-4"
						onClick={() => router.back()}
					>
						<ArrowLeftIcon className="h-6" />
					</Button>
				</div>
				<div className="absolute -bottom-20 left-10">
					<Image
						src={"/brand/default-avatar.svg"}
						removeWrapper={true}
					/>
				</div>
			</div>
			<div className="w-full px-10 flex flex-col gap-y-4">
				<div className="w-full h-20 flex items-center justify-end">
					<UserDropdown />
				</div>
				<div>
					<h1>{user.name}</h1>
					<p>@{user.username}</p>
				</div>
				<div>
					<p>{user.bio}</p>
				</div>
			</div>
		</div>
	);
}
