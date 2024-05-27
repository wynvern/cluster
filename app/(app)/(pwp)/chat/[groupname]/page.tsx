"use client";

import { fetchMessages } from "@/lib/db/groupChat/groupChat";
import getFileBase64 from "@/util/getFile";
import {
	PaperAirplaneIcon,
	PhotoIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, ScrollShadow, Image, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ListMessages } from "./ListMessages";
import type { MessageProps } from "@/lib/db/groupChat/type";
import fetchGroup from "@/lib/db/group/group";
import type Group from "@/lib/db/group/type";
import { socket } from "../../../../../lib/SocketClient";
import ChatHeader from "./ChatHeader";
import { useMessageAttr } from "@/hooks/ChatMessage";

interface FileBase64Info {
	base64: string;
	preview: string;
	file?: File;
}

export default function ChatPage({
	params,
}: {
	params: { groupname: string };
}) {
	const [isSending, setIsSending] = useState(false);
	const [selectedImage, setSelectedImage] = useState<FileBase64Info | null>(
		null
	);
	const [group, setGroup] = useState<Group | null>(null);
	const [messages, setMessages] = useState<MessageProps[]>([]);
	const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
	const session = useSession();
	const [batchIndex, setBatchIndex] = useState(1);
	const replyToMessageId = useMessageAttr((state) => state.replyToMessageId);

	async function initChat() {
		const retreivedGroup = await fetchGroup({
			groupname: params.groupname,
		});
		if (!retreivedGroup) {
			// TODO: HAndle if group doesn't exist
			return false;
		}
		setGroup(retreivedGroup);
		loadMessageBatch(retreivedGroup?.id || "", true);

		socket.emit("joinGroup", retreivedGroup?.GroupChat?.id);
	}

	function scrollDown() {
		if (endOfMessagesRef?.current) {
			endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		initChat();
	}, []);

	function onConnect() {
		if (session.data?.user) {
			socket.emit("authenticate", { token: session.data?.user });
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (group) {
			if (socket.connected) {
				onConnect();

				socket.on("receiveMessage", (message: MessageProps) => {
					setMessages((prevMessages) => [...prevMessages, message]);
					scrollDown();
				});
			}

			socket.on("connect", () => console.warn("connected to socket..."));
			socket.on("disconnect", () => console.log("disconnected"));

			return () => {
				socket.off("connect");
				socket.off("disconnect", () => console.log("disconnected"));
				socket.off("receiveMessage");
			};
		}
	}, [group]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (isSending) return false;

		setIsSending(true);
		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const message = formData.get("message") as string;

		if (message) {
			const messageToSend = {
				content: message,
				userId: session.data?.user?.id || "",
				user: {
					id: session.data?.user?.id || "",
					username: session.data?.user?.username || "",
					image: session.data?.user?.image || "",
				},
				chatId: group?.GroupChat?.id,
				media: [selectedImage?.base64 || ""],
				createdAt: new Date(),
			} as MessageProps;
			socket.emit("sendMessage", messageToSend);
			e.currentTarget.reset();
		}
		setIsSending(false);
	}

	async function handleSelectImage() {
		const file = await getFileBase64([
			"png",
			"jpg",
			"jpeg",
			"gif",
			"webp",
			"svg",
		]);

		if (file) {
			setSelectedImage(file);
		}
	}

	async function handleMessageLoadScroll(e: React.UIEvent<HTMLDivElement>) {
		if (e.currentTarget.scrollTop === 0) {
			loadMessageBatch(group?.id || "");
		}
	}

	async function loadMessageBatch(groupId: string, overwrite = false) {
		const retreivedMessages = await fetchMessages(
			groupId,
			batchIndex + (overwrite ? 0 : 1)
		);

		switch (retreivedMessages) {
			case "no-session":
				alert("sem sessão");
				return false;
			case "no-more-messages":
				alert("sem mais mensagens");
				return false;
		}
		if (overwrite) setMessages(retreivedMessages);
		else {
			setMessages((prevMessages) => [
				...retreivedMessages,
				...prevMessages,
			]);
			setBatchIndex((prev) => prev + 1);
		}
	}

	return (
		<div className="w-full max-h-[calc(100vh)] h-full flex flex-col overflow-hidden">
			{group?.groupname && <ChatHeader groupname={group.groupname} />}
			<div className="grow flex flex-col overflow-hidden my-4">
				<ScrollShadow
					className="w-full h-full px-4 sm:px-10 gap-y-4 flex flex-col overflow-auto"
					onScroll={handleMessageLoadScroll}
				>
					<ListMessages messages={messages} />
					<div ref={endOfMessagesRef} />
				</ScrollShadow>
			</div>
			<form
				onSubmit={handleSubmit}
				onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						handleSubmit(e);
					}
				}}
				className="w-full px-4 sm:px-10 flex gap-x-4 transition-height duration-200 mb-6 "
			>
				<p>{replyToMessageId}</p>
				<div className="flex flex-col default-border rounded-large p-2 grow">
					<Textarea
						placeholder="mensagem"
						variant="bordered"
						name="message"
						isDisabled={isSending}
						classNames={{ inputWrapper: "border-none" }}
						max={1000}
					/>
					{selectedImage && (
						<div className="relative">
							<Button
								color="secondary"
								size="sm"
								isIconOnly={true}
								className="absolute z-50 left-2 top-2"
								onClick={() => setSelectedImage(null)}
							>
								<XMarkIcon className="h-4" />
							</Button>
							<Image
								src={selectedImage.preview}
								removeWrapper={true}
								className="w-auto h-20"
							/>
						</div>
					)}
				</div>
				<Button
					isIconOnly={true}
					isDisabled={isSending}
					variant="bordered"
					onClick={() => handleSelectImage()}
				>
					<PhotoIcon className="h-6" />
				</Button>
				<Button
					isIconOnly={true}
					color="primary"
					isDisabled={isSending}
					type="submit"
				>
					<PaperAirplaneIcon className="h-6" />
				</Button>
			</form>
		</div>
	);
}
