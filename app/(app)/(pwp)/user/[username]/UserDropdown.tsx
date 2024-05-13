"use client";

import CustomizeProfile from "@/components/modal/CustomizeProfile";
import type User from "@/lib/db/user/type";
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
			onClick: () => alert("Bloquear usuário"),
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (session.data?.user.id) {
			setDropdownItems((prev) =>
				prev.filter(
					(item) =>
						!item.isUserPrivate ||
						defaultUser.id === session.data?.user.id
				)
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
