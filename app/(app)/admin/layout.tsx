import type { ReactNode } from "react";
import SidebarAdmin from "./_admin_components/Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import HeaderAdmin from "./_admin_components/Header";

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			{" "}
			<div className="flex w-full h-screen">
				<SidebarAdmin />
				<div className="grow h-full flex flex-col">
					<HeaderAdmin />
					<Breadcrumbs>
						<BreadcrumbItem>Home</BreadcrumbItem>
						<BreadcrumbItem>Music</BreadcrumbItem>
						<BreadcrumbItem>Artist</BreadcrumbItem>
						<BreadcrumbItem>Album</BreadcrumbItem>
						<BreadcrumbItem>Song</BreadcrumbItem>
					</Breadcrumbs>
					<div className="bg-blue-700 w-full grow">{children}</div>
				</div>
			</div>
		</>
	);
}
