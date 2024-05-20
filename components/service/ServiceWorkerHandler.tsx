"use client";

import { useEffect } from "react";
import registerSubscription from "@/lib/notification";

export default function Cluster({ children }: { children: React.ReactNode }) {
	// TODO: Will be here, but for now, it's just a placeholder and will need validation
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/service-worker.js");

			navigator.serviceWorker.addEventListener(
				"message",
				async (event) => {
					await registerSubscription({
						subscription: JSON.parse(event.data.subscription),
					});
				}
			);
		}
	}, []);

	return null;
}