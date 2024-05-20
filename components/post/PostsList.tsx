import type Post from "@/lib/db/post/type";
import type React from "react";
import SkeletonPostCard from "../card/SkeletonPostCard";
import PostCard from "../card/PostCard";
import NoPosts from "../card/NoPosts";

interface PostsListProps {
	posts: Post[] | null;
	noPosts: string;
}

const PostsList: React.FC<PostsListProps> = ({ posts, noPosts }) => {
	return (
		<div className="mt-6 flex flex-col gap-y-10">
			{posts === null ? (
				<SkeletonPostCard />
			) : (
				posts.map((post) => (
					<div key={post.id} className="bottom-border px-4 sm:px-10">
						<PostCard post={post} isUserPage={true} />
					</div>
				))
			)}
		</div>
	);
};

export default PostsList;
