"use client";

import { useSocket } from "@/providers/Socket";
import { BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BoldBellIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Notifications from "../modal/Notifications";
import { Link } from "@nextui-org/react";
import { dimissNotifications } from "@/lib/notification";
import { useSidebarStore } from "@/hooks/MobileHomeSidebar";

interface NotificationProps {
	previousNotifications: any;
	hasText?: boolean;
	onClick?: () => void;
}

export default function NotificationsButton({
	previousNotifications,
	hasText = false,
	onClick,
}: NotificationProps) {
	const socket = useSocket();
	const [notifications, setNotifications] = useState(previousNotifications);
	const [openNotifications, setOpenNotifications] = useState(false);
	const setIsSidebarOpen = useSidebarStore((state) => state.setIsSidebarOpen);

	useEffect(() => {
		if (!socket) return;

		socket.on("newNotification", (data) => {
			console.log(data);
			setNotifications((prev: any) => [...prev, data.message]);
		});
	}, [socket]);

	useEffect(() => {
		async function handler() {
			if (openNotifications) {
				setNotifications((prev: any) =>
					prev.map((n: any) => ({ ...n, viewed: true })),
				);
				dimissNotifications();
			}
		}

		handler();
	}, [openNotifications]);

	useEffect(() => {
		console.log(notifications);
	}, [notifications]);

	return (
		<>
			<Link
				className="flex items-center gap-x-4"
				onClick={() => {
					setOpenNotifications(true);
					setIsSidebarOpen(false);
					if (onClick) onClick();
				}}
			>
				<div className="relative">
					{notifications.filter((n: any) => !n.viewed).length > 0 && (
						<div
							className="rounded-full bg-blue-400 text-white flex items-center justify-center absolute w-5 h-5 text-sm right-[-3px] top-[-7px] scale-85"
							style={{
								outline:
									"3px hsl(var(--nextui-background) / var(--nextui-background-opacity, var(--tw-bg-opacity))) solid",
								scale: "0.9",
							}}
						>
							<b>{notifications.filter((n: any) => !n.viewed).length}</b>
						</div>
					)}
					{openNotifications ? (
						<BoldBellIcon className="h-7" />
					) : (
						<BellIcon className="h-7 second-foreground" />
					)}
				</div>
				{hasText && (
					<div className="sidebar-inside">
						{openNotifications ? (
							<p>Notificações</p>
						) : (
							<p className="second-foreground">Notificações</p>
						)}
					</div>
				)}
			</Link>

			<Notifications
				notifications={notifications}
				isActive={openNotifications}
				setIsActive={setOpenNotifications}
			/>
		</>
	);
}
