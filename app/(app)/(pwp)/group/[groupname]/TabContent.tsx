import PostsList from "@/components/post/PostsList";
import type Post from "@/lib/db/post/type";

export default function TabContent({ posts }: { posts: Post[] | null }) {
	return (
		<div className="w-full flex items-center flex-col mt-10">
			<PostsList posts={posts} noPosts="Sem posts" />
		</div>
	);
}
