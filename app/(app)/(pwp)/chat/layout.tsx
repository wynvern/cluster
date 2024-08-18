"use client";

import NoPosts from "@/components/card/NoPosts";
import PageHeader from "@/components/general/PageHeader";
import { fetchUserChats } from "@/lib/db/group/groupChat";
import type { UserGroupChats } from "@/lib/db/group/type";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input, Link, Image, CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function LayoutChat({
	children,
}: {
	children: React.ReactNode;
}) {
	const [userGroups, setUserGroups] = useState<UserGroupChats[]>([]);
	const session = useSession();
	const [loadingChats, setLoadingChats] = useState(true);
	const path = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleUserGroups() {
			const response = await fetchUserChats();
			setUserGroups(response);
			setLoadingChats(false);
		}

		handleUserGroups();
	}, [session]);

	const isSmallScreen = useMediaQuery({ maxWidth: 1000 });

	useEffect(() => {
		// Trigger a resize event on initial render
		window.dispatchEvent(new Event("resize"));
	}, []);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1200px] h-full relative flex">
				<div
					className={`w-1/3 ${
						isSmallScreen && path.endsWith("chat") ? "w-full" : ""
					} sidebar-border h-full ${
						isSmallScreen && !path.endsWith("chat") ? "hidden" : ""
					}`}
				>
					<PageHeader title="Chat" />
					<div className="px-4 pb-10 bottom-border">
						<Input
							placeholder="Pesquisar grupos"
							variant="bordered"
							classNames={{ inputWrapper: "h-14" }}
							startContent={
								<MagnifyingGlassIcon className="h-6" />
							}
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
									<div className="flex w-full items-center px-4 py-6 gap-x-4">
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
										<div className="flex flex-col">
											<div className="flex gap-x-1 flex-col">
												<h3 className="font-semibold">
													{group.name}
												</h3>
												<p>{group.groupname}</p>
											</div>
										</div>
									</div>
								</Link>
							))
						)}
					</div>
				</div>

				{/* Content */}
				<div
					className={`w-2/3 h-full ${
						isSmallScreen && path.endsWith("chat") ? "hidden" : ""
					}
               ${isSmallScreen && !path.endsWith("chat") ? "w-full" : ""}
               `}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
