"use client";

import CustomizeProfile from "@/components/modal/CustomizeProfile";
import type User from "@/lib/db/user/type";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@nextui-org/react";
import { useState } from "react";

export default function UserDropdown({ defaultUser }: { defaultUser: User }) {
	const [customizeProfileActive, setCustomizeProfileActive] = useState(false);

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
					<DropdownItem
						description="Customize o seu perfil"
						startContent={
							<PencilIcon className="h-8" aria-label="Sign Out" />
						}
						aria-label="customize profile"
						onClick={() => setCustomizeProfileActive(true)}
					>
						Customizar Perfil
					</DropdownItem>
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
