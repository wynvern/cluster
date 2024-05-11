import { getRole, pinPost } from "@/lib/db/group/group";
import type Post from "@/lib/db/post/type";
import {
	ArrowUpOnSquareStackIcon,
	EllipsisHorizontalIcon,
	FlagIcon,
	MapPinIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownTrigger,
	Button,
	DropdownMenu,
	DropdownItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useConfirmationModal } from "../provider/ConfirmationModal";
import { deletePost } from "@/lib/db/post/post";

interface DropdownItemProps {
	description: string;
	className: string;
	icon: JSX.Element;
	ariaLabel: string;
	text: string;
	onClick?: () => void;
}

export default function PostDropdown({
	post,
	isUserPage = false,
}: {
	post: Post;
	isUserPage?: boolean;
}) {
	const session = useSession();
	const [userRole, setUserRole] = useState<string | null | undefined>("");
	const { confirm } = useConfirmationModal();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleGetRole() {
			const role = await getRole({ groupname: post.group.groupname });
			setUserRole(role);
		}

		handleGetRole();
	}, []);

	async function handlePinPost() {
		await pinPost({ postId: post.id });
	}

	const dropdownItems = [
		// Pin Post action
		["owner", "moderator"].includes(String(userRole)) && !isUserPage
			? {
					description: "Pinar post",
					className: "text-success",
					icon: (
						<ArrowUpOnSquareStackIcon
							className="h-8"
							aria-label="Pin Post"
						/>
					),
					ariaLabel: "pin-post",
					text: "Pin Post",
					onClick: handlePinPost,
			  }
			: null,

		// Delete Post action
		(session && session.data?.user.id === post.authorId) ||
		(["owner", "moderator"].includes(String(userRole)) && !isUserPage)
			? {
					description: "Deletar este post.",
					className:
						["moderator", "owner"].includes(String(userRole)) &&
						session.data?.user.id !== post.authorId
							? "text-success"
							: "text-danger",
					icon: (
						<TrashIcon className="h-8" aria-label="Delete Post" />
					),
					ariaLabel: "delete-post",
					text: "Deletar Post",
					onClick: handleDeletePost,
			  }
			: null,

		// Report Post action
		session &&
			session.data?.user.id !== post.authorId && {
				description: "Reporte este post.",
				className: "text-danger",
				icon: <FlagIcon className="h-8" aria-label="Sign Out" />,
				ariaLabel: "report-group",
				text: "Reportar Post",
			},
	].filter(Boolean) as DropdownItemProps[]; // Filter out null values

	async function handleDeletePost() {
		await confirm({
			title: "Excluír post",
			description: "Tem certeza que deseja excluír o post?",
			onConfirm: () => {
				deletePost(post.id);
			},
			onCancel: () => {},
		});
	}

	return (
		<Dropdown className="default-border shadow-none" placement="bottom-end">
			<DropdownTrigger>
				<Button isIconOnly={true} variant="bordered">
					<EllipsisHorizontalIcon className="h-8" />
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="Static Actions">
				{dropdownItems.map((item) => (
					<DropdownItem
						key={item.description}
						description={item.description}
						className={item.className}
						startContent={item.icon}
						aria-label={item.ariaLabel}
						onClick={item.onClick}
					>
						{item.text}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}
