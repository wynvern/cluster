import { useMessageAttr } from "@/hooks/ChatMessage";
import type { MessageProps } from "@/lib/db/groupChat/type";
import {
	ArrowUturnLeftIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
} from "@nextui-org/react";

export default function ({ message }: { message: MessageProps }) {
	const setReplyToMessageId = useMessageAttr(
		(state) => state.setReplyToMessageId
	);

	function setReplyTo() {
		setReplyToMessageId(message.id);
	}

	return (
		<div className="flex items-center gap-x-4">
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
					<DropdownItem title="test" />
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}
