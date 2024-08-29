import {
	ChatBubbleBottomCenterIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@nextui-org/react";
import { headers } from "next/headers";
import NotificationsButton from "./NotificationsButton";
import { getNotifications } from "@/lib/db/user/user";
import SidebarItems from "./SidebarItems";

export default async function Sidebar() {
	const headersList = headers();
	const fullUrl = headersList.get("x-current-path") || "";
	const previousNotifications = await getNotifications();

	return (
		<>
			<SidebarItems previousNotifications={previousNotifications} />
			<div
				style={{ zIndex: "90000" }}
				className="bg-background fixed bottom-0 w-full sm:hidden flex items-center justify-around py-4 px-6 h-14 sidebar-border-mobile"
			>
				<Link href="/">
					<HomeIcon className="h-7" />
				</Link>
				<Link href="/search">
					<MagnifyingGlassIcon className="h-7" />
				</Link>
				<NotificationsButton
					previousNotifications={previousNotifications}
				/>
				<Link href="/chat">
					<ChatBubbleBottomCenterIcon className="h-7" />
				</Link>
				<Link href="/group">
					<UserGroupIcon className="h-7" />
				</Link>
			</div>
		</>
	);
}
