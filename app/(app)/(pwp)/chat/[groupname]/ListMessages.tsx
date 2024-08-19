import UserAvatar from "@/components/user/UserAvatar";
import { Link, Image, Chip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import MessageActions from "./MessageActions";
import type { MessageProps } from "@/lib/db/group/type";
import { useImageCarousel } from "@/providers/ImageDisplay";
import prettyDate from "@/util/prettyDate";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export function ListMessages({ messages }: { messages: MessageProps[] }) {
	const session = useSession();
	const { openCarousel } = useImageCarousel();

	return (
		<>
			{messages.map((message, i) => {
				const isUserMessage =
					session.data?.user?.id === message.user.id;
				const isNewDay =
					i === 0 ||
					new Date(messages[i - 1].createdAt).getDate() !==
						new Date(message.createdAt).getDate();

				return (
					<div
						key={message.id}
						className={"message-action-container"}
					>
						<div className="w-full flex justify-center">
							{isNewDay && (
								<div className="my-8 text-neutral-600 ">
									{new Date(
										message.createdAt
									).toLocaleDateString()}
								</div>
							)}
						</div>
						<div
							className={`w-full flex gap-x-2 message-animation ${
								isUserMessage ? "flex-row-reverse" : ""
							}`}
						>
							<div>
								<Image
									removeWrapper={true}
									src={
										message.user.image ||
										"/brand/default-avatar.svg"
									}
									className="w-6 h-6"
								/>
							</div>
							<div
								className={`flex flex-col gap-y-1 grow ${
									isUserMessage ? "items-end" : ""
								}`}
							>
								<div
									className={`w-full flex justify-between items-start ${
										!isUserMessage ? "flex-row-reverse" : ""
									}`}
								>
									<div>
										<MessageActions message={message} />
									</div>
									<div
										className={`flex gap-x-2 ${
											isUserMessage
												? "flex-row-reverse"
												: ""
										}`}
									>
										<Link
											href={`/user/${message.user.username}`}
										>
											<b>{message.user.username}</b>
										</Link>
										{message.replyToId && (
											<Chip
												color="warning"
												startContent={
													<ChevronLeftIcon className="h-5\" />
												}
											>
												Respondendo{" "}
												{
													messages.find(
														(m) =>
															m.id ===
															message.replyToId
													)?.user.username
												}
											</Chip>
										)}
									</div>
								</div>
								<p
									className={
										isUserMessage ? "text-rigth" : ""
									}
								>
									{message.content}
								</p>
							</div>
						</div>
						{message.media && message.media.length > 0 && (
							<div
								className={
									isUserMessage
										? "flex items-end justify-end mr-16 mt-2"
										: "flex items-start mt-2 ml-16"
								}
							>
								<div className="max-w-[300px] max-h-[400px]">
									<Image
										src={message.media[0]}
										removeWrapper={true}
										onClick={() =>
											openCarousel(message.media)
										}
									/>
								</div>
								<div />
							</div>
						)}
					</div>
				);
			})}
		</>
	);
}
