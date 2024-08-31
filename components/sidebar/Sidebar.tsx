import { getNotifications } from "@/lib/db/user/user";
import SidebarItems from "./SidebarItems";
import SidebarMobile from "./SidebarMobile";

export default async function Sidebar() {
	const previousNotifications = await getNotifications();

	return (
		<>
			<SidebarItems previousNotifications={previousNotifications} />
			<SidebarMobile previousNotifications={previousNotifications} />
		</>
	);
}
