import Sidebar from "@/components/sidebar/Sidebar";
import React, { type ReactNode } from "react";

export default async function ProtectedPages({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-w-full flex">
			<main className="grow sm:ml-20 mb-14 sm:mb-0 min-h-dvh">
				{children}
			</main>
			<Sidebar />
		</div>
	);
}
