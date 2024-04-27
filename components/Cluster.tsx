"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export default function Cluster({ children }: { children: React.ReactNode }) {
	return (
		<>
			<NextUIProvider className="dark min-h-dvh">
				<SessionProvider>{children}</SessionProvider>
			</NextUIProvider>
		</>
	);
}
