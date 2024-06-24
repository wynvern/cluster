"use client";

import { useEffect } from "react";
import registerSubscription from "@/lib/notification";
import { useSession } from "next-auth/react";

export default function ServiceWorkerHandler() {
	const session = useSession();

	// TODO: Will be here, but for now, it's just a placeholder and will need validation
	useEffect(() => {
		if ("Notification" in window && session.data?.user.username) {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					navigator.serviceWorker
						.register("/service-worker.js")
						.then(() => {
							console.warn("Service worker registered");
							navigator.serviceWorker.addEventListener(
								"message",
								async (event) => {
									await registerSubscription({
										subscription: JSON.parse(
											event.data.subscription
										),
									});
								}
							);
						});
				} else {
					console.warn("Permission not granted for Notification");
				}
			});
		}
	}, [session]);

	return null;
}
