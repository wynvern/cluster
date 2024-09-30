"use client";

import { useSocket } from "@/providers/Socket";
import { BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BoldBellIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Notifications from "../modal/Notifications";
import { Link } from "@nextui-org/react";
import { dimissNotifications } from "@/lib/notification";

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
					prev.map((n: any) => ({ ...n, viewed: true }))
				);
				dimissNotifications();
			}
		}

		handler();
	}, [openNotifications]);

	return (
		<>
			<Link
				className="flex items-center gap-x-4"
				onClick={() => {
					setOpenNotifications(true);
					if (onClick) onClick();
				}}
			>
				<div className="relative">
					{notifications.filter((n: any) => !n.viewed).length > 0 && (
						<div
							className="rounded-full bg-red-600 text-white flex items-center justify-center absolute w-5 h-5 text-sm right-[-3px] top-[-7px]"
							style={{
								outline:
									"3px hsl(var(--nextui-background) / var(--nextui-background-opacity, var(--tw-bg-opacity))) solid",
								scale: "0.9",
							}}
						>
							<b>
								{
									notifications.filter((n: any) => !n.viewed)
										.length
								}
							</b>
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
							<b>Notificações</b>
						) : (
							<b className="second-foreground">Notificações</b>
						)}
					</div>
				)}
			</Link>

			<Notifications
				defaultNotifications={notifications}
				isActive={openNotifications}
				setIsActive={setOpenNotifications}
			/>
		</>
	);
}
