"use client";

import NoPosts from "@/components/card/NoPosts";
import type { UserGroupInfo } from "@/lib/db/group/type";
import { fetchUserGroups } from "@/lib/db/user/user";
import { Input, Link, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function LayoutChat({
	children,
}: {
	children: React.ReactNode;
}) {
	const [userGroups, setUserGroups] = useState<UserGroupInfo[]>([]);

	useEffect(() => {
		async function handleUserGroups() {
			const response = await fetchUserGroups({ groupChatId: true });
			setUserGroups(response);
			console.log(response);
		}

		handleUserGroups();
	}, []);

	return (
		<div className="w-full h-full flex">
			<div className="w-1/4 h-full sidebar-border">
				<h2 className="p-10">Chat</h2>
				<div className="px-10 pb-10 bottom-border">
					<Input placeholder="Pesquisar grupos" variant="bordered" />
				</div>
				<div>
					{userGroups.length === 0 && (
						<NoPosts message="Nenhum grupo." />
					)}
					{userGroups.map((group) => (
						<Link
							key={group.id}
							className="bottom-border w-full"
							href={`/chat/${group.groupname}`}
						>
							<div className="flex w-full items-center px-10 py-6 gap-x-4">
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
									<h3>{group.groupname}</h3>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="w-3/4 h-full">{children}</div>
		</div>
	);
}
