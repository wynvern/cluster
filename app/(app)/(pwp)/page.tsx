import { fetchUserFeed } from "@/lib/db/feed/feed";
import HomePage from "./HomeFeedPage";
import HomeSidebar from "@/components/sidebar/HomeSidebar";
import { authOptions } from "@/lib/auth";
import fetchUser from "@/lib/db/user/user";
import { getServerSession } from "next-auth";

export default async function HomePageRoot() {
	const posts = await fetchUserFeed(0);

	if (typeof posts === "string") return "error";

	const session = await getServerSession(authOptions);

	if (!session?.user.username) {
		return "errror";
	}

	const loggedUser = await fetchUser({ username: session?.user?.username });

	console.log(loggedUser);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<HomeSidebar userData={loggedUser} />
				<HomePage firstPosts={posts} />
			</div>
		</div>
	);
}

export const dynamic = "force-dynamic";
