"use client";

import InfoMessage from "@/components/card/InfoMessage";
import PostComment from "@/components/card/PostComment";
import UserAvatar from "@/components/user/UserAvatar";
import { createComment } from "@/lib/db/post/comment/comment";
import type RecursiveComments from "@/lib/db/post/comment/type";
import type Post from "@/lib/db/post/type";
import { type FileBase64Info, getFilesBase64 } from "@/util/getFile";
import supportedFormats from "@/public/supportedFormats.json";

import {
	PhotoIcon,
	PaperAirplaneIcon,
	PlusIcon,
	MinusIcon,
} from "@heroicons/react/24/outline";
import { Button, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "react-toastify";

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
	const [selectedMedia, setSelectedMedia] = useState<FileBase64Info[]>([]);

	async function handleCreatePost() {
		if (!newComment.text && !selectedMedia.length) return;

		const createdComment = await createComment({
			text: newComment.text,
			postId,
			parentId,
			media: selectedMedia.map((media) => media.base64),
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
		setSelectedMedia([]);
	}

	async function addImage() {
		if (selectedMedia.length >= 4) return;

		const file = await getFilesBase64(supportedFormats.image);

		if (!file) return;

		if (Array.isArray(file)) {
			setSelectedMedia([...selectedMedia, ...file]);
		}
	}

	return (
		<div className="flex gap-x-4 items-start w-full mt-6">
			<UserAvatar size="10" avatarURL={session.data?.user.image} />
			<div className="grow">
				<Textarea
					value={newComment.text}
					onChange={(e: any) => {
						if (e.target.value.length > 1500) return;
						setNewComment({ text: e.target.value });
					}}
					placeholder="Comente"
					variant="bordered"
				/>
				<div>
					{selectedMedia.map((media, index) => (
						<div key={media.preview} className="h-40 w-auto relative">
							<Button
								isIconOnly={true}
								onClick={() => {
									setSelectedMedia((prev) =>
										prev.filter((_, i) => i !== index),
									);
								}}
								className="absolute top-4 left-4"
							>
								X
							</Button>
							<img
								src={media.preview}
								alt="imagasae"
								className="h-40 w-auto rounded mt-4"
							/>
						</div>
					))}
				</div>
			</div>
			<Button
				isIconOnly={true}
				variant="bordered"
				size="sm"
				className="p-1"
				onClick={addImage}
			>
				<PhotoIcon className="h-6" />
			</Button>
			<Button
				className="p-1"
				size="sm"
				isIconOnly={true}
				variant="bordered"
				onClick={() => handleCreatePost()}
				disabled={!newComment.text && !selectedMedia.length}
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
	const [visible, setVisible] = useState(!(level > 2));

	return (
		<div className="w-full relative">
			{comments.map((comment) => (
				<div
					key={comment.id}
					style={{
						paddingLeft: level === 0 ? "2rem" : "1.5rem",
					}}
					className={`py-4  ${
						level === 0 && "bottom-border pr-4 sm:pr-6"
					} ${level > 0 && "pb-0"}`}
				>
					{comment.children && comment.children.length > 0 && (
						<div
							className={`absolute w-10 h-10 flex items-center justify-center ${
								level === 0 ? "left-4" : "-left-6"
							}`}
						>
							<Button
								isIconOnly={true}
								variant="bordered"
								size="sm"
								onClick={() => {
									if (level > 2) {
									} else {
										setVisible(!visible);
									}
								}}
							>
								{!visible ? (
									<PlusIcon className="h-5" />
								) : (
									<MinusIcon className="h-5" />
								)}
							</Button>
						</div>
					)}

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
					{comment.children && comment.children.length > 0 && visible && (
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
	const addNewComment = (newComment: RecursiveComments, parentId?: string) => {
		setComments((prevComments) => {
			const updateCommentsRecursively = (
				comments: RecursiveComments[],
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
							children: updateCommentsRecursively(comment.children),
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
		<div className="w-full flex gap-x-4 items-start flex-col">
			<div className="px-4 sm:px-6 w-full pb-6 bottom-border">
				<CommentCreator postId={post.id} addNewComment={addNewComment} />
			</div>
			<div className="w-full">
				{comments.length > 0 ? (
					<div>
						<RenderCommentLevel
							level={0}
							comments={comments}
							postId={post.id}
							addNewComment={addNewComment}
						/>
					</div>
				) : (
					<div className="mt-12">
						<InfoMessage message="Sem comentários." />
					</div>
				)}
			</div>
			<div className="h-20" />
		</div>
	);
}
