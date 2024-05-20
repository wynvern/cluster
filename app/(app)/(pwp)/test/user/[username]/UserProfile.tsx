import type User from "@/lib/db/user/type";
import { Image } from "@nextui-org/react";
import UserActions from "./UserActions";

interface UserProfileProps {
	user: User;
}

export default async function UserProfile({ user }: UserProfileProps) {
	return (
		<div className="w-full">
			{/* Banner */}
			<div
				className={`w-full relative ${user ? "bg-neutral-800" : ""}`}
				style={{ aspectRatio: "1000 / 400" }}
			>
				<Image
					className="absolute w-full h-full rounded-none object-cover z-1"
					src={user ? (user.banner as string) : ""}
					removeWrapper={true}
				/>
				<div className="absolute -bottom-20 left-4 sm:left-10">
					<Image
						src={
							user?.image
								? user.image
								: "/brand/default-avatar.svg"
						}
						removeWrapper={true}
						className="h-[150px] sm:h-60 w-auto object-cover"
					/>
				</div>
			</div>

			{/* Information */}
			<div className="w-full px-4 sm:px-10 flex flex-col gap-y-4">
				<div className="w-full h-20 flex items-center justify-end gap-x-4">
					<UserActions user={user} />
				</div>
				<div>
					<h1>{user.name}</h1>
					<p>
						<b>u/</b>
						{user.username}
					</p>
				</div>
				<div>
					<p>{user.bio}</p>
				</div>
			</div>
		</div>
	);
}
