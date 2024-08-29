import { fetchPostById } from "@/lib/db/post/post";
import { fetchPostComments } from "@/lib/db/post/comment/comment";
import PostWrapper from "./PostWrapper";

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
		<div suppressHydrationWarning>
			<PostWrapper post={post} comments={comments} />
		</div>
	);
}
