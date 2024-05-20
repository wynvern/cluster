"use client";

import CustomizeProfile from "@/components/modal/CustomizeProfile";
import Notifications from "@/components/modal/Notifications";
import ReportProfile from "@/components/modal/ReportProfile";
import { useConfirmationModal } from "@/components/provider/ConfirmationModal";
import type User from "@/lib/db/user/type";
import { blockUser } from "@/lib/db/user/user";
import {
	BellIcon,
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
	const [notificationsActive, setNotificationsActive] = useState(false);
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

				if (response === "ok") {
					alert("Usuário bloqueado com sucesso!");
				} else {
					alert("Erro ao bloquear usuário.");
				}
			},
			description: `Tem certaza que deseja bloquear o usuário ${user.username}?`,
			title: "Bloquear Usuário",
			onCancel: () => {},
		});
	}

	return (
		<>
			<Button
				isIconOnly={true}
				variant="bordered"
				onClick={() => setNotificationsActive(true)}
			>
				<BellIcon className="h-6" />
			</Button>
			<Dropdown
				className="default-border shadow-none"
				placement="bottom-end"
			>
				<DropdownTrigger>
					<Button isIconOnly={true} variant="bordered">
						<EllipsisHorizontalIcon className="h-8" />
					</Button>
				</DropdownTrigger>
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
			<Notifications
				isActive={notificationsActive}
				setIsActive={setNotificationsActive}
			/>
			<ReportProfile
				active={reportProfileActive}
				setActive={setReportProfileActive}
				username={user.username}
			/>
		</>
	);
}
