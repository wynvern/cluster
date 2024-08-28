"use client";

import {
	HomeIcon,
	MagnifyingGlassIcon,
	ChatBubbleBottomCenterIcon,
	UserGroupIcon,
	EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import NotificationsButton from "./NotificationsButton";

export default function HomeSidebar() {
	const path = "hi";
	const [open, setOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	return (
		<>
			<div className="fixed top-6 left-6">
				<Button
					isIconOnly={true}
					color="secondary"
					className="border-default"
					onClick={() => setOpen(true)}
				>
					<EllipsisHorizontalCircleIcon className="h-6" />
				</Button>
			</div>

			{open && (
				<div
					ref={sidebarRef}
					className="fixed h-dvh sidebar-mobile border-for-sidebar flex-col sidebar-container bg-background"
					style={{ zIndex: "999999" }}
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
									<HomeIcon className="h-7" />
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
							<NotificationsButton
								previousNotifications={[]}
							/>{" "}
							<Link
								href="/search"
								className="flex items-center gap-x-4"
							>
								<div>
									<MagnifyingGlassIcon className="h-7" />
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
									<ChatBubbleBottomCenterIcon className="h-7" />
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
									<UserGroupIcon className="h-7" />
								</div>
								<div className="sidebar-inside">
									{path.startsWith("/group") ? (
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
