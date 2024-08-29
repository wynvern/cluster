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
	addNewComment,
	setActiveReplies,
}: {
	parentId?: string;
	postId: string;
	addNewComment: (newComment: RecursiveComments, parentId?: string) => void;
	setActiveReplies?: any;
}) {
	const [newComment, setNewComment] = useState({ text: "" });
	const session = useSession();

	async function handleCreatePost() {
		if (!newComment.text) return;

		const createdComment = await createComment({
			text: newComment.text,
			postId,
			parentId,
		});
		if (typeof createdComment === "string") {
			return;
		}
		if (parentId) {
			setActiveReplies((prev: any) => ({
				...prev,
				[parentId]: false,
			}));
		}
		addNewComment(createdComment, parentId);
		setNewComment({ text: "" });
	}

	return (
		<div className="flex gap-x-4 items-start w-full mt-6">
			<UserAvatar avatarURL={session.data?.user.image} />
			<Textarea
				value={newComment.text}
				onChange={(e: any) => setNewComment({ text: e.target.value })}
				placeholder="Comente"
				variant="bordered"
			/>
			<Button isIconOnly={true} variant="bordered">
				<PhotoIcon className="h-6" />
			</Button>
			<Button
				isIconOnly={true}
				variant="bordered"
				onClick={() => handleCreatePost()}
				disabled={newComment.text === ""}
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
	addNewComment,
}: {
	level: number;
	comments: RecursiveComments[];
	postId: string;
	addNewComment: (newComment: RecursiveComments, parentId?: string) => void;
}) {
	// Change to use an object to track active replies by comment ID
	const [activeReplies, setActiveReplies] = useState<{
		[key: string]: boolean;
	}>({});

	// Toggle reply active state for a specific comment
	const toggleReplyActive = (commentId: string) => {
		setActiveReplies((prevActiveReplies) => ({
			...prevActiveReplies,
			[commentId]: !prevActiveReplies[commentId],
		}));
	};

	return (
		<div className="w-full relative">
			{comments.map((comment) => (
				<div
					key={comment.id}
					style={{ paddingLeft: `${level}em` }}
					className="mt-6"
				>
					<PostComment
						comment={comment}
						setReplyActive={() => toggleReplyActive(comment.id)}
					/>
					{activeReplies[comment.id] && (
						<CommentCreator
							parentId={comment.id}
							postId={postId}
							addNewComment={addNewComment}
							setActiveReplies={setActiveReplies}
						/>
					)}
					{comment.children && comment.children.length > 0 && (
						<RenderCommentLevel
							level={level + 1}
							comments={comment.children}
							postId={postId}
							addNewComment={addNewComment}
						/>
					)}
				</div>
			))}
		</div>
	);
}

export default function ChatSection({
	post,
	comments: initialComments,
}: ChatSectionProps) {
	// Step 1: Define a new state to hold all comments
	const [comments, setComments] =
		useState<RecursiveComments[]>(initialComments);

	// Function to add a new comment to the state
	const addNewComment = (
		newComment: RecursiveComments,
		parentId?: string
	) => {
		setComments((prevComments) => {
			const updateCommentsRecursively = (
				comments: RecursiveComments[]
			): RecursiveComments[] => {
				return comments.map((comment) => {
					if (comment.id === parentId) {
						return {
							...comment,
							children: [...(comment.children || []), newComment],
						};
					}
					if (comment.children) {
						return {
							...comment,
							children: updateCommentsRecursively(
								comment.children
							),
						};
					}
					return comment;
				});
			};

			if (parentId) {
				return updateCommentsRecursively(prevComments);
			}
			return [...prevComments, newComment];
		});
	};

	return (
		<div className="w-full flex gap-x-4 items-start flex-col px-4">
			<CommentCreator postId={post.id} addNewComment={addNewComment} />
			<div className="w-full">
				{comments.length > 0 ? (
					<div className="mt-4">
						<RenderCommentLevel
							level={0}
							comments={comments}
							postId={post.id}
							addNewComment={addNewComment}
						/>
					</div>
				) : (
					<div className="mt-12">
						<NoPosts message="Sem comentários." />
					</div>
				)}
			</div>
			<div className="h-20" />
		</div>
	);
}
