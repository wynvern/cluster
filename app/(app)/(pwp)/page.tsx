import PostCard from "@/components/card/PostCard";
import { fetchUserFeed } from "@/lib/db/feed/feed";

export default async function HomePage() {
	const posts = await fetchUserFeed();

	if (typeof posts === "string") return "error";

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full relative">
				<div>
					{posts.map((post) => (
						<div key={post.id}>
							<div className="w-full bottom-border my-6" />

							<div className="px-10">
								<PostCard post={post} />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
