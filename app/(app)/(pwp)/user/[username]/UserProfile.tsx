import type User from "@/lib/db/user/type";
import { Image } from "@nextui-org/react";
import UserActions from "./UserActions";
import prettyDate from "@/util/prettyDate";

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
				<Image src={user ? (user.banner as string) + '?size=550' : ""} removeWrapper={true} className='rounded-none w-full object-cover' style={{aspectRatio: '1000 / 400'}}/>
				<div className="absolute -bottom-20 left-4 sm:left-10">
					<Image
						src={
							user?.image
								? user.image + '?size=400'
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
						Salvos <b>{user._count.bookmarks}</b>
					</p>
					<p>
						Grupos <b>{user._count.groups}</b>
					</p>
				</div>
				<div>
					<p>Entrou em <b>{prettyDate({ date: user.createdAt})}</b></p>
				</div>
			</div>
		</div>
	);
}
