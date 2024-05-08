import type { MessageProps } from "@/lib/db/groupChat/type";
import { Link, Image, Chip } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export function ListMessages({ messages }: { messages: MessageProps[] }) {
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
					<div key={message.id}>
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
							className={`w-full flex gap-x-4 message-animation ${
								message.user.id === session.data?.user?.id
									? "flex-row-reverse"
									: ""
							}`}
						>
							{i === 0 ||
							message.user.id !== messages[i - 1].user.id ? (
								<div>
									<Image
										src={
											message.user.image ||
											"/brand/default-avatar.svg"
										}
										removeWrapper={true}
										alt={message.user.username || ""}
										className="w-12 h-12"
									/>
								</div>
							) : (
								<div className="w-12" />
							)}
							<div>
								<div
									className={`flex flex-col gap-y-1 ${
										isUserMessage ? "items-end" : ""
									}`}
								>
									{i === 0 ||
									message.user.id !==
										messages[i - 1].user.id ? (
										<Link
											href={`/user/${message.user.username}`}
										>
											<b>{message.user.username}</b>
										</Link>
									) : null}
									<p
										className={
											isUserMessage ? "text-rigth" : ""
										}
									>
										{message.content}
									</p>
									<p
										className={`text-neutral-600 ${
											isUserMessage ? "text-right" : ""
										}`}
										style={{ fontSize: "12px" }}
									>
										{new Date(
											message.createdAt
										).toLocaleString()}
									</p>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
