import Sidebar from "@/components/sidebar/Sidebar";
import React, { type ReactNode } from "react";

export default async function ProtectedPages({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-h-dvh min-w-full flex">
			<Sidebar />
			<main className="grow min-h-dvh sm:ml-20 mb-14 sm:mb-0">
				{children}
			</main>
		</div>
	);
}
