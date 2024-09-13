import { Link, Image, Chip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import MessageActions from "./MessageActions";
import type { MessageProps, MessageView } from "@/lib/db/group/type";
import { useImageCarousel } from "@/providers/ImageDisplay";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import PrettyDate from "@/components/general/PrettyDate";
import UserAvatar from "@/components/user/UserAvatar";
// @ts-ignore
import { Image as NextImage } from "next/image";

export function ListMessages({ messages }: { messages: MessageView[] }) {
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
						style={{
							opacity: !message.notServerConfirmed ? 1 : 0.5,
						}}
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
							className={`w-full flex items-center gap-x-2 message-animation ${
								isUserMessage ? "flex-row-reverse" : ""
							}`}
						>
							<Link href={`/user/${message.user.username}`}>
								<UserAvatar
									avatarURL={message.user.image}
									size="8"
								/>
							</Link>
							<div
								className={`flex flex-col gap-y-1 grow ${
									isUserMessage ? "items-end" : ""
								}`}
							>
								<div
									className={`w-full flex justify-between items-center ${
										!isUserMessage ? "flex-row-reverse" : ""
									}`}
								>
									<div>
										<MessageActions message={message} />
									</div>
									<div
										className={`flex items-center gap-x-2 ${
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
										<PrettyDate
											date={new Date(message.createdAt)}
										/>
										{message.replyToId && (
											<Chip
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
							</div>
						</div>
						{message.content && (
							<div
								className={
									isUserMessage
										? "flex items-end justify-end mt-1 mr-10"
										: "flex items-start mt-1 ml-10"
								}
							>
								<p
									className={`${
										isUserMessage ? "text-right" : ""
									}`}
									style={{ wordBreak: "break-all" }}
								>
									{message.content}
								</p>
							</div>
						)}
						{message.media && message.media.length > 0 && (
							<div
								className={
									isUserMessage
										? "flex items-end justify-end mr-10 mt-2"
										: "flex items-start mt-2 ml-10"
								}
							>
								<div className="max-w-[300px] max-h-[400px]">
									<Image
										as={NextImage}
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
