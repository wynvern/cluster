import { Image } from "@nextui-org/react";

export default function SidebarAdmin() {
	return (
		<div className="w-72 h-full bg-red-700 p-6">
			<div className="flex items-center gap-x-3">
				<Image src="/brand/logo.svg" className="h-10 w-10" />
				<h2>Admin</h2>
			</div>
		</div>
	);
}
