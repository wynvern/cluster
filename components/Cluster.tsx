"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ConfirmationModalProvider } from "./provider/ConfirmationModal";
import { useEffect } from "react";

export default function Cluster({ children }: { children: React.ReactNode }) {
	// TODO: Will be here, but for now, it's just a placeholder and will need validation
	useEffect(() => {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				console.log("Notification permission granted.");
			} else {
				console.log("Notification permission denied.");
			}
		});
	}, []);

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/service-worker.js")
				.then((registration) =>
					console.log("scope is: ", registration.scope)
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
