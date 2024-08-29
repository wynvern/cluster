"use client";

import {
	HomeIcon,
	MagnifyingGlassIcon,
	ChatBubbleBottomCenterIcon,
	UserGroupIcon,
	EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import {
	HomeIcon as SolidHomeIcon,
	MagnifyingGlassIcon as SolidMagnifyingGlassIcon,
	ChatBubbleBottomCenterIcon as SolidChatBubbleBottomCenterIcon,
	UserGroupIcon as SolidUserGroupIcon,
	EllipsisHorizontalCircleIcon as SolidEllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import NotificationsButton from "./NotificationsButton";
import { usePathname } from "next/navigation";

export default function HomeSidebar() {
	const [open, setOpen] = useState(false);
	const path = usePathname();

	useEffect(() => {
		console.log("path", path);
	}, [path]);

	return (
		<>
			<div className="fixed top-6 left-6" style={{ zIndex: "90000" }}>
				<Button
					isIconOnly={true}
					color="secondary"
					className="border-default"
					onClick={() => setOpen(true)}
				>
					<EllipsisHorizontalCircleIcon className="h-6" />
				</Button>
			</div>

			<div
				style={{ zIndex: "90001", backdropFilter: "blur(10px)" }}
				className={`fixed w-full h-full ${open ? "visible" : "hidden"}`}
				onClick={() => setOpen(false)}
				onKeyDown={() => setOpen(false)}
			/>

			{open && (
				<div
					className="fixed h-dvh sidebar-mobile border-for-sidebar flex-col sidebar-container bg-background"
					style={{ zIndex: "90002" }}
				>
					<div className="flex flex-col justify-between h-full sidebar-wrapper py-6">
						<div className="flex items-center gap-x-4 pl-[7px]">
							<Link href="/">
								<Image
									alt="logo"
									className="h-8 w-8 invert-image"
									src="/brand/logo.svg"
									height={50}
									width={50}
									priority={true}
									draggable={false}
								/>
							</Link>
							<div className="sidebar-inside">
								<h2 className="main-text">Cluster</h2>
							</div>
						</div>
						<div className="flex flex-col gap-y-8 pl-[9.5px]">
							<Link
								href="/"
								className="flex items-center gap-x-4"
							>
								<div>
									{path === "/" ? (
										<SolidHomeIcon className="h-7" />
									) : (
										<HomeIcon className="h-7" />
									)}
								</div>
								<div className="sidebar-inside">
									{path === "/" ? (
										<p>
											<b>Home</b>
										</p>
									) : (
										<p>Home</p>
									)}
								</div>
							</Link>
							{/* TODO: Load previous notifications */}
							<NotificationsButton previousNotifications={[]} />
							<Link
								href="/search"
								className="flex items-center gap-x-4"
							>
								<div>
									{path.includes("/search") ? (
										<SolidMagnifyingGlassIcon className="h-7" />
									) : (
										<MagnifyingGlassIcon className="h-7" />
									)}
								</div>
								<div className="sidebar-inside">
									{path.startsWith("/search") ? (
										<p>
											<b>Pesquisa</b>
										</p>
									) : (
										<p>Pesquisa</p>
									)}
								</div>
							</Link>
							<Link
								href="/chat"
								className="flex items-center gap-x-4"
							>
								<div>
									{path.includes("/search") ? (
										<SolidChatBubbleBottomCenterIcon className="h-7" />
									) : (
										<ChatBubbleBottomCenterIcon className="h-7" />
									)}
								</div>
								<div className="sidebar-inside">
									{path.startsWith("/chat") ? (
										<p>
											<b>Chat</b>
										</p>
									) : (
										<p>Chat</p>
									)}
								</div>
							</Link>
							<Link
								href="/group"
								className="flex items-center gap-x-4"
							>
								<div>
									{path === "/group" ? (
										<SolidUserGroupIcon className="h-7" />
									) : (
										<UserGroupIcon className="h-7" />
									)}{" "}
								</div>
								<div className="sidebar-inside">
									{path === "/group" ? (
										<p>
											<b>Grupos</b>
										</p>
									) : (
										<p>Grupos</p>
									)}
								</div>
							</Link>
						</div>
						<div>
							<ProfileDropdown />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
