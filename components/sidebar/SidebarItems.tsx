"use client";

import {
	ChatBubbleBottomCenterIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsButton from "./NotificationsButton";
import {
	HomeIcon as SolidHomeIcon,
	MagnifyingGlassIcon as SolidMagnifyingGlassIcon,
	ChatBubbleBottomCenterIcon as SolidChatBubbleBottomCenterIcon,
	UserGroupIcon as SolidUserGroupIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export default function SidebarItems({
	previousNotifications,
	userData,
}: {
	previousNotifications: any;
	userData: any;
}) {
	const path = usePathname();

	return (
		<div className="fixed h-dvh  border-for-sidebar flex-col sidebar-container bg-background hidden sm:flex z-40">
			<div className="flex flex-col justify-between h-full sidebar-wrapper py-6">
				<div className="flex items-center gap-x-4 pl-[7px]">
					<Image
						alt="logo"
						className="h-8 w-8 invert-image min-w-8"
						src="/brand/logo.svg"
						height={50}
						width={50}
						priority={true}
						draggable={false}
					/>
					<div className="sidebar-inside">
						<h2 className="main-text">Cluster</h2>
					</div>
				</div>
				<div className="flex flex-col gap-y-8 pl-[9.5px]">
					<Link href="/" className="flex items-center gap-x-4">
						<div>
							{path === "/" ? (
								<SolidHomeIcon className="h-7" />
							) : (
								<HomeIcon className="h-7 second-foreground" />
							)}
						</div>
						<div
							className={`sidebar-inside ${
								path === "/" ? "" : "second-foreground"
							}`}
						>
							<p>
								<b>Home</b>
							</p>
						</div>
					</Link>
					{/* TODO: Load previous notifications */}
					<NotificationsButton
						previousNotifications={previousNotifications}
						hasText={true}
					/>
					<Link href="/search" className="flex items-center gap-x-4">
						<div>
							{path.includes("/search") ? (
								<SolidMagnifyingGlassIcon className="h-7" />
							) : (
								<MagnifyingGlassIcon className="h-7 second-foreground" />
							)}
						</div>
						<div
							className={`sidebar-inside ${
								path.startsWith("/search")
									? ""
									: "second-foreground"
							}`}
						>
							<p>
								<b>Pesquisa</b>
							</p>
						</div>
					</Link>
					<Link href="/chat" className="flex items-center gap-x-4">
						<div>
							{path.includes("/chat") ? (
								<SolidChatBubbleBottomCenterIcon className="h-7" />
							) : (
								<ChatBubbleBottomCenterIcon className="h-7 second-foreground" />
							)}
						</div>
						<div
							className={`sidebar-inside ${
								path.startsWith("/chat")
									? ""
									: "second-foreground"
							}`}
						>
							<p>
								<b>Chat</b>
							</p>
						</div>
					</Link>
					<Link href="/group" className="flex items-center gap-x-4">
						<div>
							{path === "/group" ? (
								<SolidUserGroupIcon className="h-7" />
							) : (
								<UserGroupIcon className="h-7 second-foreground" />
							)}
						</div>
						<div
							className={`sidebar-inside ${
								path === "/group" ? "" : "second-foreground"
							}`}
						>
							<p>
								<b>Grupos</b>
							</p>
						</div>
					</Link>
				</div>
				<div>
					<ProfileDropdown userData={userData} />
				</div>
			</div>
		</div>
	);
}
