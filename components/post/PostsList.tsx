import type Post from "@/lib/db/post/type";
import type React from "react";
import SkeletonPostCard from "../card/SkeletonPostCard";
import PostCard from "../card/PostCard";

interface PostsListProps {
	posts: Post[] | null;
	isUserPage?: boolean;
}

export default function PostList({ posts, isUserPage = true }: PostsListProps) {
	return (
		<div className="mt-6 flex flex-col gap-y-10">
			{posts === null ? (
				<SkeletonPostCard />
			) : (
				posts.map((post) => (
					<div key={post.id} className="bottom-border px-4 sm:px-10">
						<PostCard post={post} isUserPage={isUserPage} />
					</div>
				))
			)}
		</div>
	);
}
