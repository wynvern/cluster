"use client";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
	Image,
} from "@nextui-org/react";
import { useState } from "react";
import SignOut from "../modal/SignOut";
import {
	ArrowLeftEndOnRectangleIcon,
	Cog6ToothIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
	const [signOutModal, setSignOutModal] = useState(false);
	const session = useSession();

	return (
		<>
			<Dropdown className="default-border shadow-none" placement="right">
				<DropdownTrigger>
					<Link className="p-4">
						<Image
							removeWrapper={true}
							src="/brand/default-avatar.svg"
						/>
					</Link>
				</DropdownTrigger>
				<DropdownMenu aria-label="Static Actions">
					<DropdownItem
						description="Veja seu perfil"
						startContent={
							<UserIcon className="h-8" aria-label="Sign Out" />
						}
						aria-label="View profile"
						href={`/user/${session.data?.user.username}`}
					>
						Perfil
					</DropdownItem>
					<DropdownItem
						description="Configure o aplicativo"
						startContent={
							<Cog6ToothIcon
								className="h-8"
								aria-label="Sign Out"
							/>
						}
						aria-label="View profile"
					>
						Configurações
					</DropdownItem>
					<DropdownItem
						description="Desconecte-se de sua conta"
						className="text-danger"
						onClick={() => {
							setSignOutModal(true);
						}}
						startContent={
							<ArrowLeftEndOnRectangleIcon
								className="h-8"
								aria-label="Sign Out"
							/>
						}
						aria-label="Sign Out"
					>
						Sair
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<SignOut setIsActive={setSignOutModal} isActive={signOutModal} />
		</>
	);
}
