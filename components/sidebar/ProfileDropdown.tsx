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
	EllipsisHorizontalIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import UserAvatar from "../user/UserAvatar";

export default function ProfileDropdown({ onClick }: { onClick?: () => void }) {
	const [signOutModal, setSignOutModal] = useState(false);
	const session = useSession();

	return (
		<>
			<div className="flex w-full justify-between items-center pr-4">
				<div className="flex gap-x-4 items-center">
					<UserAvatar avatarURL={session.data?.user.image} />
					<div className="flex flex-col">
						<p className=" sidebar-inside">
							u/{session.data?.user.username}
						</p>
					</div>
				</div>
				<div className="sidebar-inside">
					<Dropdown
						className="default-border shadow-none"
						// @ts-ignore
						placement="left"
					>
						<DropdownTrigger>
							<Link className="transition-all duration-200">
								<EllipsisHorizontalIcon className="h-6" />
							</Link>
						</DropdownTrigger>
						{/* @ts-ignore */}
						<DropdownMenu aria-label="Static Actions">
							<DropdownItem
								description="Veja seu perfil"
								startContent={
									<UserIcon
										className="h-6"
										aria-label="Sign Out"
									/>
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
									if (onClick) onClick();
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
				</div>
			</div>

			<SignOut setIsActive={setSignOutModal} isActive={signOutModal} />
		</>
	);
}
