"use client";

import NoPosts from "@/components/card/NoPosts";
import type { UserGroupInfo } from "@/lib/db/group/type";
import { fetchUserGroups } from "@/lib/db/user/user";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input, Link, Image, CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function ChatSidebar({
	userGroups,
	loadingChats,
	hideWhenSM,
	selectedGroupname,
}: {
	userGroups: UserGroupInfo[];
	loadingChats: boolean;
	selectedGroupname: string;
	hideWhenSM: boolean;
}) {
	const isHidden = hideWhenSM
		? ""
		: "sm:block hidden w-full sm:w-1/4 h-full sidebar-border";

	return (
		<div className={isHidden}>
			<h2 className="pt-10 pb-6 px-4 sm:px-10">Chat</h2>
			<div className="px-4 sm:px-10 pb-10 bottom-border">
				<Input
					placeholder="Pesquisar grupos"
					variant="bordered"
					classNames={{ inputWrapper: "h-14" }}
					startContent={<MagnifyingGlassIcon className="h-6" />}
				/>
			</div>
			<div>
				{userGroups.length === 0 && !loadingChats && (
					<NoPosts message="Nenhum grupo." />
				)}
				{loadingChats ? (
					<div className="w-full my-10 flex items-center justify-center">
						<CircularProgress />
					</div>
				) : (
					userGroups.map((group) => (
						<Link
							key={group.id}
							className="bottom-border w-full"
							href={`/chat/${group.groupname}`}
						>
							<div className="flex w-full items-center px-4 sm:px-10 py-6 gap-x-4">
								<div>
									<Image
										src={
											group.image ||
											"/brand/default-group.svg"
										}
										removeWrapper={true}
										className="h-12 w-12"
									/>
								</div>
								<div>
									<h2>{group.name}</h2>
									<p>{group.groupname}</p>
								</div>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}

export default function LayoutChat({
	children,
}: {
	children: React.ReactNode;
}) {
	const [userGroups, setUserGroups] = useState<UserGroupInfo[]>([]);
	const session = useSession();
	const [loadingChats, setLoadingChats] = useState(true);
	const path = usePathname();

	useEffect(() => {
		async function handleUserGroups() {
			const response = await fetchUserGroups(
				session?.data?.user.id || "",
				{ groupChatId: true }
			);
			setUserGroups(response);
			setLoadingChats(false);
		}

		handleUserGroups();
	}, [session]);

	const selectedGroupname = path.split("/")[2];

	return (
		<div className="w-full h-full flex">
			<ChatSidebar
				loadingChats={loadingChats}
				selectedGroupname={selectedGroupname}
				userGroups={userGroups}
				hideWhenSM={false}
			/>
			<ChatSidebar
				loadingChats={loadingChats}
				selectedGroupname={selectedGroupname}
				userGroups={userGroups}
				hideWhenSM={true}
			/>
			<div
				className={
					selectedGroupname
						? "w-full h-full"
						: "hidden sm:flex sm:w-3/4 h-full"
				}
			>
				{children}
			</div>
		</div>
	);
}
