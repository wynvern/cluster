import UserAvatar from "@/components/user/UserAvatar";
import prettyDate from "@/util/prettyDate";
import { Link, Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import MessageActions from "./MessageActions";
import type { MessageProps } from "@/lib/db/group/type";

export function ListMessages({
	messages,
	ref,
}: {
	messages: MessageProps[];
	ref: React.RefObject<HTMLDivElement>;
}) {
	const session = useSession();

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
									{prettyDate({ date: message.createdAt })}
								</div>
							)}
						</div>
						<div
							className={`w-full flex gap-x-4 message-animation ${
								isUserMessage ? "flex-row-reverse" : ""
							}`}
						>
							{i === 0 ||
							message.user.id !== messages[i - 1].user.id ||
							isNewDay ? (
								<div>
									<UserAvatar
										avatarURL={message.user.image}
									/>
								</div>
							) : (
								<div className="w-12" />
							)}
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
									{i === 0 ||
									message.user.id !==
										messages[i - 1].user.id ||
									isNewDay ? (
										<Link
											href={`/user/${message.user.username}`}
										>
											<b>{message.user.username}</b>
										</Link>
									) : null}
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
									/>
								</div>
								<div />
							</div>
						)}
						<p
							className={`text-neutral-600 mt-2 ${
								isUserMessage ? "text-right mr-16" : "ml-16"
							}`}
							style={{ fontSize: "12px" }}
						>
							{new Date(message.createdAt).toLocaleString()}
						</p>
					</div>
				);
			})}
		</>
	);
}
