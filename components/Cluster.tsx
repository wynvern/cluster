"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ConfirmationModalProvider } from "./provider/ConfirmationModal";

export default function Cluster({ children }: { children: React.ReactNode }) {
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
