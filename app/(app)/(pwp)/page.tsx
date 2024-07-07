import PostCard from "@/components/card/PostCard";
import { fetchUserFeed } from "@/lib/db/feed/feed";
import HomePage from "./HomeFeedPage";

export default async function HomePageRoot() {
	const posts = await fetchUserFeed(0);

	if (typeof posts === "string") return "error";

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<HomePage firstPosts={posts} />
			</div>
		</div>
	);
}
