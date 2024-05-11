"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ConfirmationModalProvider } from "./provider/ConfirmationModal";
import { useEffect } from "react";
import registerSubscription from "@/lib/notification";
import { ThemeProvider as NextThemesProvider } from "next-themes";

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

	return (
		<>
			<NextUIProvider className="min-h-dvh">
				<SessionProvider>
					<ConfirmationModalProvider>
						<NextThemesProvider
							attribute="class"
							defaultTheme="dark"
						>
							{children}
						</NextThemesProvider>
					</ConfirmationModalProvider>
				</SessionProvider>
			</NextUIProvider>
		</>
	);
}
