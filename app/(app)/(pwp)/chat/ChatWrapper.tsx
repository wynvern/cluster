"use client";

import InfoMessage from "@/components/card/InfoMessage";
import PageHeader from "@/components/general/PageHeader";
import type { MessageProps, UserGroupChats } from "@/lib/db/group/type";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input, Link, Image, user } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// @ts-ignore
import { Image as NextImage } from "next/image";
import { useMediaQuery } from "react-responsive";
import { useSocket } from "@/providers/Socket";
import GroupChatDropdown from "./GroupChatDropdown";

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
	const socket = useSocket();
	const router = useRouter();

	useEffect(() => {
		setIsSmallScreen(isSmallScreenQuery);
	}, [isSmallScreenQuery]);
	const [lastMessages, setLastMessages] = useState<{
		[chatId: string]: {
			username: string;
			content: string;
		} | null;
	}>({});

	function handleSearch(value: string) {
		setShownUserGroups(
			userGroups.filter(
				(group) =>
					group.groupname
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					group.name?.toLowerCase().includes(value.toLowerCase())
			)
		);
	}

	useEffect(() => {
		if (!socket) return;

		socket.on(
			"notificationMessage",
			(message: { message: MessageProps }) => {
				console.log("message", message);
				setLastMessages((prev) => ({
					...prev,
					[message.message.chatId]: {
						username: message.message.user.username || "Anônimo",
						content: message.message.content || "Imagem",
					},
				}));
			}
		);

		socket.on("receiveMessage", (message: MessageProps) => {
			setLastMessages((prev) => ({
				...prev,
				[message.chatId]: {
					username: message.user.username || "Anônimo",
					content: message.content || "Imagem",
				},
			}));
		});
	}, [socket]);

	const truncateMessage = (message: string, maxLength: number) => {
		if (message.length > maxLength) {
			return `${message.substring(0, maxLength)}...`;
		}
		return message;
	};

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1200px] h-full relative flex resize-x">
				<div
					className={`w-1/3 ${
						isSmallScreen && path.endsWith("chat") ? "w-full" : ""
					} sidebar-border h-full ${
						isSmallScreen && !path.endsWith("chat") ? "hidden" : ""
					}`}
				>
					<PageHeader title="Chat" />
					<div className="px-4 pb-4 bottom-border">
						<Input
							placeholder="Pesquisar grupos"
							variant="bordered"
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
							<div
								key={group.id}
								className="relative bottom-border flex w-full items-center justify-between px-4 py-4 gap-x-4"
							>
								<div
									className="absolute z-10 w-full h-full cursor-pointer"
									onClick={() =>
										router.push(`/chat/${group.groupname}`)
									}
									onKeyDown={() =>
										router.push(`/chat/${group.groupname}`)
									}
								/>
								<div className="flex items-center gap-x-3">
									<div>
										<Image
											as={NextImage}
											src={
												group.image ||
												"/brand/default-group.svg"
											}
											removeWrapper={true}
											className="h-12 w-12 z-1"
										/>
									</div>
									<div className="flex flex-col">
										<div className="flex gap-x-1 flex-col">
											<div className="flex items-center gap-x-1">
												<h3 className="font-semibold">
													{group.name}
												</h3>
												<p className="second-foreground">
													g/{group.groupname}
												</p>
											</div>
											{group.GroupChat?.id &&
												lastMessages[
													group.GroupChat.id
												] && (
													<p>
														<b>
															u/
															{
																lastMessages[
																	group
																		.GroupChat
																		.id
																]?.username
															}
															:{" "}
														</b>
														{truncateMessage(
															lastMessages[
																group.GroupChat
																	.id
															]?.content || "",
															15
														)}
													</p>
												)}
										</div>
									</div>
								</div>
								<div>
									<GroupChatDropdown group={group} />
								</div>
							</div>
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
