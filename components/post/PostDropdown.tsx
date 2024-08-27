"use client";

import type Post from "@/lib/db/post/type";
import {
	ArrowUpOnSquareStackIcon,
	EllipsisHorizontalIcon,
	FlagIcon,
	ShareIcon,
	ShieldCheckIcon,
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
import { approvePost, deletePost, pinPost } from "@/lib/db/post/post";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import { getMemberRole } from "@/lib/db/group/groupMember";
import { toast } from "react-toastify";

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
			const role = await getMemberRole({
				groupname: post.group.groupname,
			});
			setUserRole(role);
		}

		handleGetRole();
	}, []);

	async function handlePinPost() {
		await pinPost({ postId: post.id });
	}

	async function handleApprovePost() {
		await confirm({
			title: "Aprovar post",
			description:
				"Tem certeza que deseja aprovar o post? Lembre-se de verficar se está de acordo com as regras do grupo",
			onConfirm: () => {
				approvePost({ postId: post.id });
			},
			isDanger: false,
			onCancel: () => {},
		});
	}

	async function sharePost() {
		if (navigator.share) {
			await navigator.share({
				title: post.title,
				text: post.content,
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(
				`${window.location.host}/post/${post.id}`
			);
			toast.success("Link copiado para a área de transferência", {
				autoClose: 3000,
			});
		}
	}

	const dropdownItems = [
		// Approve Post action
		["owner", "moderator"].includes(String(userRole)) && !isUserPage
			? {
					description: "Aprovar post",
					className: "text-success",
					icon: (
						<ShieldCheckIcon
							className="h-8"
							aria-label="Pin Post"
						/>
					),
					ariaLabel: "approve-post",
					text: "Aprovar Post",
					onClick: handleApprovePost,
			  }
			: null,

		{
			description: "Compartilhar esse post.",
			className: "",
			icon: <ShareIcon className="h-8" aria-label="Pin Post" />,
			ariaLabel: "share-post",
			text: "Compartilhar",
			onClick: sharePost,
		},

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
			isDanger: true,
			onCancel: () => {},
		});
	}

	return (
		// @ts-ignore
		<Dropdown className="default-border shadow-none" placement="bottom-end">
			<DropdownTrigger>
				<Button isIconOnly={true} variant="bordered">
					<EllipsisHorizontalIcon className="h-8" />
				</Button>
			</DropdownTrigger>
			{/* @ts-ignore */}
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
