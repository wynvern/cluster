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
		<div className="flex flex-col">
			{posts === null ? (
				<SkeletonPostCard />
			) : (
				posts.map((post) => (
					<div key={post.id} className="bottom-border py-4">
						<PostCard
							post={post}
							isUserPage={isUserPage}
							limitText={true}
						/>
					</div>
				))
			)}
		</div>
	);
}
