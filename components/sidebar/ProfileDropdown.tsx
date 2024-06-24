"use client";

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import SignOut from "../modal/SignOut";
import {
	ArrowLeftEndOnRectangleIcon,
	Cog6ToothIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import UserAvatar from "../user/UserAvatar";

export default function ProfileDropdown() {
	const [signOutModal, setSignOutModal] = useState(false);
	const session = useSession();

	return (
		<>
			<Dropdown className="default-border shadow-none" placement="right">
				<DropdownTrigger>
					<Link className="p-4 transition-all duration-200">
						<UserAvatar avatarURL={session.data?.user.image} />
					</Link>
				</DropdownTrigger>
				<DropdownMenu aria-label="Static Actions">
					<DropdownItem>
						Logado como <b>@{session.data?.user.username}</b>
					</DropdownItem>
					<DropdownItem
						description="Veja seu perfil"
						startContent={
							<UserIcon className="h-6" aria-label="Sign Out" />
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
								className="h-6"
								aria-label="Sign Out"
							/>
						}
						href="/settings"
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
								className="h-6"
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
