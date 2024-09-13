"use client";

import { getFilesBase64 } from "@/util/getFile";
import {
	ChevronDownIcon,
	PaperAirplaneIcon,
	PhotoIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, ScrollShadow, Image, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ListMessages } from "./ListMessages";
import type Group from "@/lib/db/group/type";
import { useMessageAttr } from "@/hooks/ChatMessage";
import type { MessageProps, MessageView } from "@/lib/db/group/type";
import { fetchMessages } from "@/lib/db/group/groupChat";
import { useSocket } from "@/providers/Socket";
import supportedFormats from "@/public/supportedFormats.json";
import { toast } from "react-toastify";
import InfoMessage from "@/components/card/InfoMessage";
import PageHeader from "@/components/general/PageHeader";

interface FileBase64Info {
	base64: string;
	preview: string;
	file?: File;
}

const messagesToConfirm: number[] = [];
let messagesLoaded = 0;

interface ChatPageProps {
	group: Group;
	latestMessages: MessageView[];
}

export default function ChatPage({ group, latestMessages }: ChatPageProps) {
	const [selectedImages, setSelectedImages] = useState<
		FileBase64Info[] | null
	>(null);
	const [messages, setMessages] = useState<MessageView[]>(latestMessages);
	const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
	const session = useSession();
	const [batchIndex, setBatchIndex] = useState(1);
	const replyToMessageContent = useMessageAttr(
		(state) => state.replyToMessage
	);
	const setReplyToMessageContent = useMessageAttr(
		(state) => state.setReplyToMessageContent
	);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const [userTyping, setUserTyping] = useState<
		{ userId: string; username: string }[]
	>([]);
	// Cooldown System
	const [cooldownActive, setCooldownActive] = useState(false);
	const [lastMessagesTimestamps, setLastMessagesTimestamps] = useState<
		number[]
	>([]);

	function verifyCooldown(timestamp: number) {
		setLastMessagesTimestamps((prev) => [...prev, timestamp]);
		setTimeout(() => {
			setLastMessagesTimestamps((prev) =>
				prev.filter((time) => time !== timestamp)
			);
		}, 5000);

		if (lastMessagesTimestamps.length > 2) {
			setCooldownActive(true);
			toast.warn("Você está enviando mensagens muito rápido.", {
				autoClose: 10000,
			});
			setTimeout(() => {
				setCooldownActive(false);
			}, 10000);
		}
	}

	const socket = useSocket();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsAtBottom(entry.isIntersecting);
			},
			{
				threshold: 0.5,
			}
		);

		if (endOfMessagesRef.current) {
			observer.observe(endOfMessagesRef.current);
		}

		messagesLoaded = latestMessages.length;

		return () => {
			if (endOfMessagesRef.current) {
				observer.unobserve(endOfMessagesRef.current);
			}
		};
	}, []);

	function scrollDown() {
		if (endOfMessagesRef?.current) {
			endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!socket) return;

		function onConnect() {
			if (!socket) return;

			console.warn("connected to socket server");
			socket.emit("joinRoom", { chatId: group?.GroupChat?.id });
		}

		socket.on("receiveMessage", (message: MessageProps) => {
			if (
				messagesToConfirm.includes(
					new Date(message.createdAt).valueOf()
				)
			) {
				// changes the property notServerConfirmed to false
				setMessages((prevMessages) => {
					const index = prevMessages.findIndex(
						(msg) =>
							new Date(msg.createdAt).valueOf() ===
							new Date(message.createdAt).valueOf()
					);
					if (index !== -1) {
						const updatedMessages = [...prevMessages];
						updatedMessages[index] = {
							...updatedMessages[index],
							notServerConfirmed: false,
						};
						return updatedMessages;
					}
					return prevMessages;
				});
				messagesToConfirm.splice(
					messagesToConfirm.findIndex(
						(timestamp) =>
							timestamp === new Date(message.createdAt).valueOf()
					),
					1
				);
			} else setMessages((prevMessages) => [...prevMessages, message]);

			messagesLoaded++;
		});

		socket.on("typing", (data: { userId: string; username: string }) => {
			setUserTyping((prev) => [...prev, data]);
			setTimeout(() => {
				setUserTyping((prev) =>
					prev.filter((user) => user.userId !== data.userId)
				);
			}, 2000);
		});

		onConnect();

		return () => {
			socket.off("receiveMessage");
			socket.off("typing");
		};
	}, [socket]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!socket) return;
		if (cooldownActive) return;

		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const message = formData.get("message") as string;

		if (message || (selectedImages && selectedImages.length > 0)) {
			verifyCooldown(new Date().valueOf());

			const messageToSend = {
				content: message,
				userId: session.data?.user?.id || "",
				user: {
					id: session.data?.user?.id || "",
					username: session.data?.user?.username || "",
					image: session.data?.user?.image || "",
				},

				chatId: group?.GroupChat?.id,
				media:
					selectedImages && selectedImages?.length > 0
						? selectedImages.map((image) => image.base64)
						: [],
				replyToId: replyToMessageContent?.id,
				createdAt: new Date(),
				notServerConfirmed: true,
				chat: {
					group: {
						groupname: group?.groupname || "",
					},
				},
			} as MessageView;

			messagesToConfirm.push(messageToSend.createdAt.valueOf());
			socket.emit("sendMessage", messageToSend);
			e.currentTarget.reset();
			setReplyToMessageContent(null);
			setSelectedImages(null);
			setMessages((prevMessages) => [...prevMessages, messageToSend]);
		}
	}

	async function handleSelectImage() {
		try {
			const file = await getFilesBase64(supportedFormats.image);

			if (selectedImages && selectedImages?.length + file.length > 4) {
				toast.error("Máximo de 4 imagens por mensagem.", {
					autoClose: 3000,
				});
				return;
			}

			if (file.length > 0) {
				setSelectedImages((prevImages) =>
					prevImages ? [...prevImages, ...file] : [...file]
				);
			}
		} catch (e) {
			switch ((e as { message: string }).message) {
				case "file-too-large":
					toast.error(
						`Arquivo muito grande. Máximo de ${process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE} MB.`,
						{
							autoClose: 3000,
						}
					);
					break;
				case "invalid-file-type":
					toast.error("Tipo de arquivo inválido.", {
						autoClose: 3000,
					});
					break;
				default:
					toast.error("Erro ao adicionar documento.", {
						autoClose: 3000,
					});
					break;
			}
		}
	}

	async function handleMessageLoadScroll(e: React.UIEvent<HTMLDivElement>) {
		const scrollContainer = e.currentTarget;

		if (scrollContainer.scrollTop === 0) {
			const oldScrollHeight = scrollContainer.scrollHeight;
			await loadMessageBatch(group?.id || "");

			setTimeout(() => {
				const newScrollHeight = scrollContainer.scrollHeight;
				scrollContainer.scrollTop = newScrollHeight - oldScrollHeight;
			}, 0);
		}
	}

	async function loadMessageBatch(groupId: string) {
		console.log(messagesLoaded, "messagesLoaded");
		const retreivedMessages = await fetchMessages(groupId, messagesLoaded);
		if (typeof retreivedMessages === "string") return;
		messagesLoaded += retreivedMessages.length;

		setMessages((prevMessages) => [...retreivedMessages, ...prevMessages]);
		setBatchIndex((prev) => prev + 1);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isAtBottom) {
			scrollDown();
		}
	}, [messages]);

	return (
		<div className="w-full max-h-[calc(100vh)] h-full flex flex-col overflow-hidden">
			{group?.groupname && (
				<PageHeader
					title={group?.groupname}
					enableHeightUsage={true}
					showBackButton={true}
				/>
			)}
			<div className="grow flex flex-col overflow-hidden my-4 bottom-border">
				<ScrollShadow
					className="w-full h-full px-4 sm:px-10 gap-y-4 flex flex-col overflow-auto relative"
					onScroll={handleMessageLoadScroll}
				>
					{messages.length === 0 && (
						<div className="w-full h-full flex items-center justify-center">
							<InfoMessage message="Este grupo ainda não tem nenhuma mensagem. Seja o primeiro a escrever algo!" />
						</div>
					)}
					<ListMessages messages={messages} />
					<div ref={endOfMessagesRef} className="opacity-0">
						abc
					</div>
				</ScrollShadow>
				{!isAtBottom && (
					<div className="absolute bottom-40 right-10">
						<Button
							isIconOnly={true}
							onClick={() => scrollDown()}
							color="secondary"
							className="default-border"
						>
							<ChevronDownIcon className="h-6" />
						</Button>
					</div>
				)}
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
				<div className="flex flex-col grow gap-y-2">
					{replyToMessageContent?.id && (
						<div className="p-2 rounded-large items-center default-border flex">
							<Button
								isIconOnly={true}
								color="secondary"
								onClick={() => setReplyToMessageContent(null)}
							>
								<XMarkIcon className="h-6" />
							</Button>
							<div className="flex gap-x-1 text-tiny">
								{`Respondendo ${replyToMessageContent?.authorUsername}: ${replyToMessageContent?.content}`}
							</div>
						</div>
					)}
					<Textarea
						placeholder="Escreva aqui"
						variant="bordered"
						name="message"
						classNames={{ inputWrapper: "border-none" }}
						max={1000}
					/>
					{selectedImages && selectedImages.length > 0 && (
						<div className="flex gap-x-2">
							{selectedImages.map((image, index) => (
								<div className="relative" key={image.preview}>
									<Button
										color="secondary"
										size="sm"
										isIconOnly={true}
										className="absolute z-50 left-2 top-2"
										onClick={() => {
											const newSelectedImages =
												selectedImages.filter(
													(_, i) => i !== index
												);
											setSelectedImages(
												newSelectedImages
											);
										}}
									>
										<XMarkIcon className="h-4" />
									</Button>
									<Image
										src={image.preview}
										removeWrapper={true}
										className="w-auto h-20 max-w-20 object-cover"
									/>
								</div>
							))}
						</div>
					)}
					{userTyping.length > 0 &&
						userTyping.map((user) => (
							<div key={user.userId}>
								<p>{user.username} está digitando...</p>
							</div>
						))}
				</div>
				<Button
					isIconOnly={true}
					variant="bordered"
					size="sm"
					onClick={() => handleSelectImage()}
				>
					<PhotoIcon className="h-6" />
				</Button>
				<Button
					size="sm"
					isIconOnly={true}
					color="primary"
					isDisabled={cooldownActive}
					type="submit"
				>
					<PaperAirplaneIcon className="h-6" />
				</Button>
			</form>
		</div>
	);
}
