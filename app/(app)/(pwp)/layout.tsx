import Sidebar from "@/components/sidebar/Sidebar";
import React, { type ReactNode } from "react";

export default function Test({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-dvh min-w-full flex">
			<Sidebar />
			<main>{children}</main>
		</div>
	);
}
