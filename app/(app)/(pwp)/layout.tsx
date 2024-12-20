import Sidebar from "@/components/sidebar/Sidebar";
import React, { type ReactNode } from "react";

export default async function ProtectedPages({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-w-full flex">
			<main className="grow sm:ml-20 sm:pb-0 min-h-dvh max-w-dvw overflow-hidden">
				{children}
			</main>
			<Sidebar />
		</div>
	);
}
