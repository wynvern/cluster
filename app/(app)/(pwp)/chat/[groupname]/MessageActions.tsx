import { useMessageAttr } from "@/hooks/ChatMessage";
import { deleteMessage } from "@/lib/db/group/groupChat";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import type { MessageProps } from "@/lib/db/group/type";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import {
	ArrowUturnLeftIcon,
	EllipsisHorizontalIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ({ message }: { message: MessageProps }) {
	const { confirm } = useConfirmationModal();
	const session = useSession();
	const [hasGroupPermission, setHasGroupPermission] = useState(false);
	const setReplyToMessageId = useMessageAttr(
		(state) => state.setReplyToMessageContent
	);

	function setReplyTo() {
		setReplyToMessageId({
			id: message.id,
			content: message.content,
			authorUsername: message.user.username || "",
		});
	}

	async function handleDeleteMessage() {
		await confirm({
			title: "Excluír mensagem",
			description: "Tem certeza que deseja excluír essa mensagem?",
			onCancel: () => {},
			onConfirm: async () => {
				await deleteMessage(message.id);
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
		<div className="flex items-center gap-x-4 message-actions">
			<Link onClick={setReplyTo}>
				<ArrowUturnLeftIcon className="h-4" />
			</Link>
			<Dropdown>
				<DropdownTrigger>
					<Link>
						<EllipsisHorizontalIcon className="h-6" />
					</Link>
				</DropdownTrigger>
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
