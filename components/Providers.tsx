"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ServiceWorkerHandler from "./service/ServiceWorkerHandler";
import { ConfirmationModalProvider } from "@/providers/ConfirmationModal";
import { ImageCarouselProvider } from "@/providers/ImageDisplay";
import { SocketProvider } from "@/providers/Socket";
import { ToastProvider } from "@/providers/Toast";

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
							<ImageCarouselProvider>
								<ToastProvider>
									<SocketProvider>{children}</SocketProvider>
								</ToastProvider>
							</ImageCarouselProvider>
							<ServiceWorkerHandler />
						</NextThemesProvider>
					</ConfirmationModalProvider>
				</SessionProvider>
			</NextUIProvider>
		</>
	);
}
