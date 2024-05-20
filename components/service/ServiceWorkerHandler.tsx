"use client";

import { useEffect } from "react";
import registerSubscription from "@/lib/notification";

export default function ServiceWorkerHandler() {
	// TODO: Will be here, but for now, it's just a placeholder and will need validation
	useEffect(() => {
		if ("serviceWorker" in navigator && "Notification" in window) {
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
					console.log("Permission not granted for Notification");
				}
			});
		}
	}, []);

	return null;
}
