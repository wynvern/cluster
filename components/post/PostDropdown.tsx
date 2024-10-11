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
import {
	approvePost,
	deletePost,
	disapprovePost,
	pinPost,
	unpinPost,
} from "@/lib/db/post/post";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import { getMemberRole } from "@/lib/db/group/groupMember";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReportPost from "../modal/ReportPost";

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
	const router = useRouter();
	const [activePostReport, setActivePostReport] = useState(false);

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
		await confirm({
			title: "Pin Post",
			description:
				"Tem certeza que deseja fixar o post ao topo do grupo?",
			onCancel: () => {},
			onConfirm: async () => {
				await pinPost({ postId: post.id });
				toast.success("Post fixado com sucesso", { autoClose: 3000 });
				window.location.reload();
			},
		});
	}

	async function handleApprovePost() {
		await confirm({
			title: "Aprovar post",
			description:
				"Tem certeza que deseja aprovar o post? Lembre-se de verficar se está de acordo com as regras do grupo",
			onConfirm: async () => {
				await approvePost({ postId: post.id });
				toast.success("Post aprovado com sucesso", { autoClose: 3000 });
				window.location.reload();
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
		{
			description: "Compartilhar esse post.",
			className: "",
			icon: <ShareIcon className="h-8" aria-label="Pin Post" />,
			ariaLabel: "share-post",
			text: "Compartilhar",
			onClick: sharePost,
		},
		// Approve Post action
		["owner", "moderator"].includes(String(userRole)) &&
		!isUserPage &&
		!post.approved
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

		// Pin Post action
		["owner", "moderator"].includes(String(userRole)) &&
		!isUserPage &&
		!post.pinned
			? {
					description: "Fixar post ao topo do grupo.",
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

		// Unpin post action
		["owner", "moderator"].includes(String(userRole)) &&
		!isUserPage &&
		post.pinned
			? {
					description: "Desafixar post do topo do grupo.",
					className: "text-danger",
					icon: (
						<ArrowUpOnSquareStackIcon
							className="h-8"
							aria-label="Unpin Post"
						/>
					),
					ariaLabel: "unpin-post",
					text: "Desafixar Post",
					onClick: async () => {
						await confirm({
							title: "Unpin Post",
							description:
								"Are you sure you want to unpin this post?",
							onConfirm: async () => {
								await unpinPost({ postId: post.id });
								toast.success("Post unpinned successfully", {
									autoClose: 3000,
								});
								window.location.reload();
							},
							isDanger: true,
							onCancel: () => {},
						});
					},
			  }
			: null,

		// Delete post approval action
		["owner", "moderator"].includes(String(userRole)) &&
		!isUserPage &&
		post.approved
			? {
					description: "Desaprovar post",
					className: "text-danger",
					icon: (
						<ShieldCheckIcon
							className="h-8"
							aria-label="Unapprove Post"
						/>
					),
					ariaLabel: "unapprove-post",
					text: "Desaprovar Post",
					onClick: async () => {
						await confirm({
							title: "Desaprovar Post",
							description:
								"Tem certeza que deseja desaprovar este post?",
							onConfirm: async () => {
								await disapprovePost({ postId: post.id });
								toast.success("Post desaprovado com sucesso", {
									autoClose: 3000,
								});
								window.location.reload();
							},
							isDanger: true,
							onCancel: () => {},
						});
					},
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
				onClick: () => setActivePostReport(true),
			},
	].filter(Boolean) as DropdownItemProps[]; // Filter out null values

	async function handleDeletePost() {
		await confirm({
			title: "Excluír post",
			description: "Tem certeza que deseja excluír o post?",
			onConfirm: async () => {
				const result = await deletePost(post.id);
				console.log(result, "result");
				// Delete div with id post.id
				switch (result) {
					case "ok": {
						const postElement = document.getElementById(
							`post-${post.id}`
						);
						if (postElement?.parentElement) {
							postElement.parentElement.remove();
						}
						toast.success("Post excluído com sucesso", {
							autoClose: 3000,
						});
						if (window.location.pathname === `/post/${post.id}`) {
							router.back();
						}
						break;
					}
					default: {
						toast.error("Erro ao excluir post", {
							autoClose: 3000,
						});
						break;
					}
				}
			},
			isDanger: true,
			onCancel: () => {},
		});
	}

	return (
		<>
			<Dropdown
				className="default-border shadow-none"
				// @ts-ignore
				placement="right"
			>
				<DropdownTrigger>
					<Button isIconOnly={true} variant="bordered" size="sm">
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

			<ReportPost
				active={activePostReport}
				setActive={setActivePostReport}
				postId={post.id}
			/>
		</>
	);
}
