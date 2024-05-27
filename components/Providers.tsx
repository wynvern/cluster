"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ConfirmationModalProvider } from "./provider/ConfirmationModal";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ServiceWorkerHandler from "./service/ServiceWorkerHandler";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<NextUIProvider>
				<SessionProvider>
					<ConfirmationModalProvider>
						<NextThemesProvider
							attribute="class"
							defaultTheme="light"
						>
							{children}
							<ServiceWorkerHandler />
						</NextThemesProvider>
					</ConfirmationModalProvider>
				</SessionProvider>
			</NextUIProvider>
		</>
	);
}
