"use client";

import { useSocket } from "@/providers/Socket";
import { BellIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface NotificationProps {
	previousNotifications: any;
}

export default function NotificationsButton({
	previousNotifications,
}: NotificationProps) {
	const socket = useSocket();
	const [notifications, setNotifications] = useState([
		...previousNotifications,
	]);

	useEffect(() => {
		if (!socket) return;

		socket.on("newNotification", (data) => {
			setNotifications((prev) => [...prev, data]);
		});
	}, [socket]);

	return (
		<div className="flex items-center gap-x-4">
			<div className="relative">
				{notifications.length > 0 && (
					<div
						className="rounded-full bg-red-600 text-white flex items-center justify-center absolute w-5 h-5 text-sm right-[-3px] top-[-7px]"
						style={{
							outline: "2px hsl(var(--nextui-background) solid",
							scale: "0.9",
						}}
					>
						<b>{notifications.length}</b>
					</div>
				)}
				<BellIcon className="h-7" />
			</div>
			<div className="sidebar-inside">
				<p>Notificações</p>
			</div>
		</div>
	);
}
