import { fetchPostById } from "@/lib/db/post/post";
import { fetchPostComments } from "@/lib/db/post/comment/comment";
import PostWrapper from "./PostWrapper";
import { getMemberRole } from "@/lib/db/group/groupMember";

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

	const userRole = await getMemberRole({ groupname: post.group.groupname });

	return (
		<div suppressHydrationWarning>
			<PostWrapper post={post} comments={comments} userRole={userRole} />
		</div>
	);
}
