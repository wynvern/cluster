import { fetchPostById } from "@/lib/db/post/post";
import ImageViewer from "./ImageViewer";
import PostCard from "@/components/card/PostCard";
import GoBack from "./GoBack";
import ChatSection from "./ChatSection";
import NoPosts from "@/components/card/NoPosts";
import { fetchPostComments } from "@/lib/db/post/comment/comment";

interface PostPageProps {
	params: {
		id: string;
	};
}

export default async function ({ params }: PostPageProps) {
	const post = await fetchPostById(params.id);

	if (!post) {
		return "no post";
	}

	const comments = await fetchPostComments(params.id);

	return (
		<div className="w-full h-full flex">
			<div className="h-full w-1/2 sidebar-border">
				<div className="p-10 w-full">
					<div className="mb-10">
						<GoBack />
					</div>
					<PostCard
						post={post}
						disableLink={true}
						disableImages={true}
					/>
					<ChatSection post={post} comments={comments} />
				</div>
			</div>
			<div className="h-full w-1/2 flex items-center justify-center">
				{post.media && <ImageViewer media={post?.media} />}
			</div>
		</div>
	);
}
