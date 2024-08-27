"use client";

import CustomizeProfile from "@/components/modal/CustomizeProfile";
import ReportProfile from "@/components/modal/ReportProfile";
import type User from "@/lib/db/user/type";
import { blockUser } from "@/lib/db/user/user";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import {
	EllipsisHorizontalIcon,
	FlagIcon,
	NoSymbolIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function UserActions({ user }: { user: User }) {
	const [customizeProfileActive, setCustomizeProfileActive] = useState(false);
	const [reportProfileActive, setReportProfileActive] = useState(false);
	const session = useSession();
	const { confirm } = useConfirmationModal();
	const [dropdownItems, setDropdownItems] = useState([
		{
			isUserPrivate: true,
			description: "Customize o seu perfil",
			icon: <PencilIcon className="h-8" aria-label="Sign Out" />,
			ariaLabel: "customize profile",
			onClick: () => setCustomizeProfileActive(true),
			text: "Customizar Perfil",
		},
		{
			isUserPrivate: false,
			description: "Bloquear usuário",
			icon: <NoSymbolIcon className="h-8" aria-label="Sign Out" />,
			ariaLabel: "block user",
			onClick: handleBlockUser,
			text: "Bloquear Perifl",
			className: "text-danger",
		},
		{
			isUserPrivate: false,
			description: "Reportar usuário",
			icon: <FlagIcon className="h-8" aria-label="Sign Out" />,
			ariaLabel: "report user",
			onClick: () => setReportProfileActive(true),
			text: "Reportar Perfil",
			className: "text-danger",
		},
	]);

	async function handleBlockUser() {
		await confirm({
			isDanger: true,
			onConfirm: async () => {
				const response = await blockUser(user.id);
			},
			description: `Tem certaza que deseja bloquear o usuário ${user.username}?`,
			title: "Bloquear Usuário",
			onCancel: () => {},
		});
	}

	return (
		<>
			<Dropdown
				className="default-border shadow-none"
				// @ts-ignore
				placement="bottom-end"
			>
				<DropdownTrigger>
					<Button isIconOnly={true} variant="bordered">
						<EllipsisHorizontalIcon className="h-8" />
					</Button>
				</DropdownTrigger>
				{/* @ts-ignore */}
				<DropdownMenu aria-label="Static Actions">
					{dropdownItems
						.filter((item) =>
							session.data?.user.id === user.id
								? item.isUserPrivate
								: !item.isUserPrivate
						)
						.map((item) => (
							<DropdownItem
								key={item.ariaLabel}
								description={item.description}
								startContent={item.icon}
								aria-label={item.ariaLabel}
								onClick={item.onClick}
								className={item.className}
							>
								{item.text}
							</DropdownItem>
						))}
				</DropdownMenu>
			</Dropdown>

			<CustomizeProfile
				onUpdate={() => window.location.reload()}
				active={customizeProfileActive}
				setActive={setCustomizeProfileActive}
				user={user}
			/>
			<ReportProfile
				active={reportProfileActive}
				setActive={setReportProfileActive}
				username={user.username}
			/>
		</>
	);
}
