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

interface DropdownItemProps {
	description: string;
	className: string;
	icon: JSX.Element;
	ariaLabel: string;
	text: string;
	onClick?: () => void;
}

export default function PostDropdown({ post }: { post: Post }) {
	const session = useSession();
	const [userRole, setUserRole] = useState<string | null | undefined>("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleGetRole() {
			const role = await getRole({ groupname: post.group.groupname });
			setUserRole(role);
		}

		handleGetRole();
	}, []);

	async function handlePinPost() {
		const response = await pinPost({ postId: post.id });
	}

	const dropdownItems = [
		userRole === "owner" && {
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
		},
		session &&
			session.data?.user.id === post.authorId && {
				description: "Deletar este post.",
				className: ["moderator", "owner"].includes(String(userRole))
					? "text-success"
					: "text-danger",
				icon: <TrashIcon className="h-8" aria-label="Delete Post" />,
				ariaLabel: "delete-post",
				text: "Deletar Post",
			},

		{
			description: "Reporte este post.",
			className: "text-danger",
			icon: <FlagIcon className="h-8" aria-label="Sign Out" />,
			ariaLabel: "report-group",
			text: "Reportar Post",
		},
	].filter(Boolean) as DropdownItemProps[];

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
