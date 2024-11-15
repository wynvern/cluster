import { fetchUserFeed } from "@/lib/db/feed/feed";
import HomePage from "./HomeFeedPage";
import HomeSidebar from "@/components/sidebar/HomeSidebar";
import { authOptions } from "@/lib/auth";
import fetchUser, { getUserGroupRoles } from "@/lib/db/user/user";
import { getServerSession } from "next-auth";

export default async function HomePageRoot() {
	const posts = await fetchUserFeed(0);

	if (typeof posts === "string") return "error";

	const session = await getServerSession(authOptions);

	if (!session?.user.username) {
		return "errror";
	}

	const userGroupRoles = await getUserGroupRoles();

	if (typeof userGroupRoles === "string") return "error";

	const loggedUser = await fetchUser({ username: session?.user?.username });

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<HomeSidebar userData={loggedUser} />
				<HomePage firstPosts={posts} userGroupRoles={userGroupRoles} />
			</div>
		</div>
	);
}

export const dynamic = "force-dynamic";
