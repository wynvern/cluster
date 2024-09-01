"use client";

import InfoMessage from "@/components/card/InfoMessage";
import PageHeader from "@/components/general/PageHeader";
import type { UserGroupChats } from "@/lib/db/group/type";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input, Link, Image, user } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// @ts-ignore
import { Image as NextImage } from "next/image";
import { useMediaQuery } from "react-responsive";

interface ChatWrapperProps {
	children: React.ReactNode;
	userGroups: UserGroupChats[];
}

export default function ChatWrapper({
	children,
	userGroups,
}: ChatWrapperProps) {
	const path = usePathname();
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const isSmallScreenQuery = useMediaQuery({ maxWidth: 1000 });
	const [shownUserGroups, setShownUserGroups] =
		useState<UserGroupChats[]>(userGroups);

	useEffect(() => {
		setIsSmallScreen(isSmallScreenQuery);
	}, [isSmallScreenQuery]);

	function handleSearch(value: string) {
		setShownUserGroups(
			userGroups.filter((group) =>
				group.groupname.toLowerCase().includes(value.toLowerCase())
			)
		);
	}

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
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => handleSearch(e.target.value)}
						/>
					</div>
					<div>
						{shownUserGroups.length === 0 && (
							<div className="my-10">
								<InfoMessage message="Nenhum grupo." />
							</div>
						)}
						{shownUserGroups.map((group) => (
							<Link
								key={group.id}
								className="bottom-border w-full"
								href={`/chat/${group.groupname}`}
							>
								<div className="flex w-full items-center px-4 py-6 gap-x-4">
									<div>
										<Image
											as={NextImage}
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
						))}
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
