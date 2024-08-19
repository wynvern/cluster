"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ServiceWorkerHandler from "./service/ServiceWorkerHandler";
import { ConfirmationModalProvider } from "@/providers/ConfirmationModal";
import { ImageCarouselProvider } from "@/providers/ImageDisplay";
import { SocketProvider } from "@/providers/Socket";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImageCropperProvider } from "@/providers/ImageCropper";

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
								<SocketProvider>
									<ImageCropperProvider>
										{children}
									</ImageCropperProvider>
								</SocketProvider>
							</ImageCarouselProvider>
							<ServiceWorkerHandler />
						</NextThemesProvider>
					</ConfirmationModalProvider>
				</SessionProvider>
			</NextUIProvider>

			<ToastContainer
				stacked={true}
				newestOnTop={true}
				position="bottom-center"
				theme="dark"
				transition={Slide}
				limit={1}
			/>
		</>
	);
}
