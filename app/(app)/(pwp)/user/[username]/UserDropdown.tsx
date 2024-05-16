"use client";

import CustomizeProfile from "@/components/modal/CustomizeProfile";
import { useConfirmationModal } from "@/components/provider/ConfirmationModal";
import type User from "@/lib/db/user/type";
import { blockUser } from "@/lib/db/user/user";
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
import { useEffect, useState } from "react";

export default function UserDropdown({ defaultUser }: { defaultUser: User }) {
	const [customizeProfileActive, setCustomizeProfileActive] = useState(false);
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
			onClick: () => alert("Reportar usuário"),
			text: "Reportar Perfil",
			className: "text-danger",
		},
	]);
	const session = useSession();

	async function handleBlockUser() {
		await confirm({
			isDanger: true,
			onConfirm: async () => {
				const response = await blockUser(defaultUser.id);

				if (response === "ok") {
					alert("Usuário bloqueado com sucesso!");
				} else {
					alert("Erro ao bloquear usuário.");
				}
			},
			description: `Tem certaza que deseja bloquear o usuário ${defaultUser.username}?`,
			title: "Bloquear Usuário",
			onCancel: () => {},
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (session.data?.user.id === defaultUser.id) {
			setDropdownItems((prev) =>
				prev.filter((item) => item.isUserPrivate === true)
			);
		} else {
			setDropdownItems((prev) =>
				prev.filter((item) => item.isUserPrivate === false)
			);
		}
	}, [session]);

	return (
		<>
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
					{dropdownItems.map((item) => (
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
				defaultUser={defaultUser}
			/>
		</>
	);
}
