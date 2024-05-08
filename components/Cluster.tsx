"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ConfirmationModalProvider } from "./provider/ConfirmationModal";
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
					console.log("subscription received");
					await registerSubscription({
						subscription: JSON.parse(event.data.subscription),
					});
				}
			);
		}
	}, []);

	return (
		<>
			<NextUIProvider className="min-h-dvh">
				<SessionProvider>
					<ConfirmationModalProvider>
						{children}
					</ConfirmationModalProvider>
				</SessionProvider>
			</NextUIProvider>
		</>
	);
}
