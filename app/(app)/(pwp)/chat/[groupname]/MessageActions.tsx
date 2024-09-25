import { useMessageAttr } from "@/hooks/ChatMessage";
import { deleteMessage } from "@/lib/db/group/groupChat";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import type { MessageProps } from "@/lib/db/group/type";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import { useSocket } from "@/providers/Socket";
import {
	ArrowUturnLeftIcon,
	EllipsisHorizontalIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ({ message }: { message: MessageProps }) {
	const { confirm } = useConfirmationModal();
	const session = useSession();
	const [hasGroupPermission, setHasGroupPermission] = useState(false);
	const setReplyToMessageId = useMessageAttr(
		(state) => state.setReplyToMessageContent
	);
	const socket = useSocket();

	function setReplyTo() {
		setReplyToMessageId({
			id: message.id,
			content: message.content || "",
			authorUsername: message.user.username || "",
		});
	}

	async function handleDeleteMessage() {
		await confirm({
			title: "Excluír mensagem",
			description: "Tem certeza que deseja excluír essa mensagem?",
			onCancel: () => {},
			onConfirm: async () => {
				const r = await deleteMessage(message.id);
				switch (r) {
					case "ok":
						{
							if (socket) {
								socket.emit("deleteMessage", {
									id: message.id,
									chatId: message.chatId,
								});
							}
							toast.success("Mensagem excluída com sucesso", {
								autoClose: 3000,
							});
						}
						break;
					default:
						toast.error("Erro ao excluir mensagem", {
							autoClose: 3000,
						});
				}
			},
		});
	}

	const DropdownItems = [
		{
			title: "Deletar",
			description: "Deletar mensagem",
			className: "text-danger",
			startContent: <TrashIcon className="h-6" />,
			onClick: handleDeleteMessage,
			needAdmin: true,
			needUserOwner: true,
		},
		{
			title: "Responder",
			description: "Responder mensagem",
			startContent: <ArrowUturnLeftIcon className="h-6" />,
			onClick: setReplyTo,
			needAdmin: false,
			needUserOwner: false,
		},
	];

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleHasPermission = async () => {
			if (!session.data?.user.username) return;
			const permission = await memberHasPermission(
				session.data.user.id,
				message.chat.group.groupname,
				"moderator"
			);
			setHasGroupPermission(permission);
		};
		handleHasPermission();
	}, [session.data?.user]);

	return (
		<div className="flex items-center gap-x-4 ml-2">
			{/* @ts-ignore */}
			<Dropdown backdrop="blur">
				<DropdownTrigger>
					<Button size="sm" color="secondary" isIconOnly={true}>
						<EllipsisHorizontalIcon className="h-6" />
					</Button>
				</DropdownTrigger>
				{/* @ts-ignore */}
				<DropdownMenu>
					{DropdownItems.filter(
						(item) =>
							(session.data?.user.id === message.userId &&
								item.needUserOwner) ||
							(hasGroupPermission && item.needAdmin)
					).map((item) => (
						<DropdownItem key={item.title} {...item} />
					))}
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}
