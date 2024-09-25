import fetchUser, { getNotifications } from "@/lib/db/user/user";
import SidebarItems from "./SidebarItems";
import SidebarMobile from "./SidebarMobile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Sidebar() {
	const previousNotifications = await getNotifications();
	const session = await getServerSession(authOptions);

	if (!session?.user.username) {
		return "errror";
	}

	const loggedUser = await fetchUser({ username: session?.user?.username });

	console.log(loggedUser);

	return (
		<>
			<SidebarItems
				previousNotifications={previousNotifications}
				userData={loggedUser}
			/>
			<SidebarMobile previousNotifications={previousNotifications} />
		</>
	);
}
