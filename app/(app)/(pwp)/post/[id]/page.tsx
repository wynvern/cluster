import { fetchPostById } from "@/lib/db/post/post";
import ImageViewer from "./ImageViewer";
import PostCard from "@/components/card/PostCard";
import GoBack from "./GoBack";
import ChatSection from "./ChatSection";
import NoPosts from "@/components/card/NoPosts";
import { fetchPostComments } from "@/lib/db/post/comment/comment";
import PageHeader from "@/components/general/PageHeader";
import { useImageCarousel } from "@/providers/ImageDisplay";
import { Link } from "@nextui-org/react";

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
		<div
			className={`w-full h-full flex ${
				post.media.length < 1 && "justify-center"
			}`}
		>
			<div
				className={`h-full ${
					post.media.length < 1
						? "w-full max-w-[1000px] side-borders"
						: "w-1/2 sidebar-border"
				}`}
			>
				<div className="w-full">
					<PageHeader title="Post" showBackButton={true} />
					<div className="bottom-border w-full mb-6" />
					<PostCard
						post={post}
						disableLink={true}
						disableImages={true}
					/>
					<div className="bottom-border w-full" />
					<ChatSection post={post} comments={comments} />
				</div>
			</div>
			{post.media && post.media.length > 0 && (
				<div className="h-dvh w-1/2 flex items-center justify-center">
					<ImageViewer media={post?.media} />
				</div>
			)}
		</div>
	);
}
