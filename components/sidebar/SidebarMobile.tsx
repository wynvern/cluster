"use client";

import {
	ChatBubbleBottomCenterIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
	HomeIcon as SolidHomeIcon,
	MagnifyingGlassIcon as SolidMagnifyingGlassIcon,
	ChatBubbleBottomCenterIcon as SolidChatBubbleBottomCenterIcon,
	UserGroupIcon as SolidUserGroupIcon,
} from "@heroicons/react/24/solid";
import { Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import NotificationsButton from "./NotificationsButton";

export default function SidebarMobile({
	previousNotifications,
}: {
	previousNotifications: any;
}) {
	const path = usePathname();

	return (
		<div
			style={{ zIndex: "90000" }}
			className="bg-background fixed bottom-0 w-full sm:hidden flex items-center justify-around py-4 px-6 h-14 sidebar-border-mobile"
		>
			<Link href="/">
				{path === "/" ? (
					<SolidHomeIcon className="h-7" />
				) : (
					<HomeIcon className="h-7" />
				)}
			</Link>
			<Link href="/search">
				{path.includes("/search") ? (
					<SolidMagnifyingGlassIcon className="h-7" />
				) : (
					<MagnifyingGlassIcon className="h-7" />
				)}
			</Link>
			<NotificationsButton
				previousNotifications={previousNotifications}
			/>
			<Link href="/chat">
				{path.includes("/chat") ? (
					<SolidChatBubbleBottomCenterIcon className="h-7" />
				) : (
					<ChatBubbleBottomCenterIcon className="h-7" />
				)}
			</Link>
			<Link href="/group">
				{path === "/group" ? (
					<SolidUserGroupIcon className="h-7" />
				) : (
					<UserGroupIcon className="h-7" />
				)}
			</Link>
		</div>
	);
}
