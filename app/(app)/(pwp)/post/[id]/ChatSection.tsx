"use client";

import NoPosts from "@/components/card/NoPosts";
import PostComment from "@/components/card/PostComment";
import UserAvatar from "@/components/user/UserAvatar";
import { createComment } from "@/lib/db/post/comment/comment";
import type RecursiveComments from "@/lib/db/post/comment/type";
import type Post from "@/lib/db/post/type";
import { PhotoIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ChatSectionProps {
	post: Post;
	comments: RecursiveComments[];
}

function CommentCreator({
	parentId,
	postId,
}: {
	parentId?: string;
	postId: string;
}) {
	const [newComment, setNewComment] = useState({ text: "" });
	const session = useSession();

	async function handleCreatePost() {
		await createComment({ text: newComment.text, postId, parentId });
	}

	return (
		<div className="flex gap-x-4 items-start w-full">
			<UserAvatar avatarURL={session.data?.user.image} />
			<Textarea
				value={newComment.text}
				onChange={(e) => setNewComment({ text: e.target.value })}
				placeholder="Escreva seu comentário..."
				variant="bordered"
			/>
			<Button isIconOnly={true} variant="bordered">
				<PhotoIcon className="h-6" />
			</Button>
			<Button
				isIconOnly={true}
				variant="bordered"
				onClick={() => handleCreatePost()}
			>
				<PaperAirplaneIcon className="h-6" />
			</Button>
		</div>
	);
}

function RenderCommentLevel({
	level,
	comments,
	postId,
}: {
	level: number;
	comments: RecursiveComments[];
	postId: string;
}) {
	const [replyActive, setReplyActive] = useState(false);

	return (
		<div className="w-full">
			{comments.map((comment) => (
				<div key={comment.id} className={`pl-[${level * 10}px]`}>
					<PostComment
						comment={comment}
						setReplyActive={() => setReplyActive(!replyActive)}
					/>
					{replyActive && (
						<CommentCreator parentId={comment.id} postId={postId} />
					)}
					{comment.children && comment.children.length > 0 && (
						<RenderCommentLevel
							level={level + 1}
							comments={comment.children}
							postId={postId}
						/>
					)}
				</div>
			))}
		</div>
	);
}

export default function ({ post, comments }: ChatSectionProps) {
	console.log(comments);

	return (
		<div className="pl-16 w-full flex gap-x-4 items-start flex-col">
			<CommentCreator postId={post.id} />
			<div className="w-full">
				{comments.length > 0 ? (
					<div>
						<RenderCommentLevel
							level={0}
							comments={comments}
							postId={post.id}
						/>
					</div>
				) : (
					<NoPosts message="Sem comentários." />
				)}
			</div>
		</div>
	);
}
