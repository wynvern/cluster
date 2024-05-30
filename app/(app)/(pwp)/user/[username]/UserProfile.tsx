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
					className="absolute w-full h-full rounded-none object-cover z-1 max-w-[1000px] max-h-[400px]"
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
						className="h-[120px] sm:h-60 object-cover aspect-square"
					/>
				</div>
			</div>

			{/* Information */}
			<div className="w-full px-4 sm:px-10 flex flex-col gap-y-4">
				<div className="w-full h-20 flex items-center justify-end">
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
				<div className="flex gap-x-2">
					<p>
						Posts <b>{user._count.posts}</b>
					</p>
					<p>
						Membros <b>{user._count.bookmarks}</b>
					</p>
					<p>
						Grupos <b>{user._count.groups}</b>
					</p>
				</div>
			</div>
		</div>
	);
}
