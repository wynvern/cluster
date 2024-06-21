import PostCard from "@/components/card/PostCard";
import { fetchUserFeed } from "@/lib/db/feed/feed";

export default async function HomePage() {
	const posts = await fetchUserFeed();

	if (typeof posts === "string") return "error";

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<div className="px-10">
					{posts.map((post) => (
						<PostCard post={post} key={post.id} />
					))}
				</div>
			</div>
		</div>
	);
}
