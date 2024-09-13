"use client";

import type Post from "@/lib/db/post/type";
import {
	ArrowUpOnSquareStackIcon,
	ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { Chip, Image, Link, Tooltip } from "@nextui-org/react";
import PostDropdown from "../post/PostDropdown";
import BookmarkPost from "../post/BookmarkPost";
import UserAvatar from "../user/UserAvatar";
import { useState } from "react";
import MediaDisplayPost from "../post/MediaDisplayPost";
import { useImageCarousel } from "@/providers/ImageDisplay";
// @ts-ignore
import { Image as NextImage } from "next/image";
import PrettyDate from "../general/PrettyDate";

export default function PostCard({
	post,
	isUserPage = false,
	disableLink = false,
	disableImages = false,
	disableComments = false,
	limitText = false,
}: {
	post: Post;
	disableImages?: boolean;
	isUserPage?: boolean;
	disableLink?: boolean;
	disableComments?: boolean;
	limitText?: boolean;
}) {
	const [mediaIndex, setMediaIndex] = useState(0);
	const { openCarousel } = useImageCarousel();

	function renderContent() {
		switch (limitText) {
			case true:
				return post.content.length > 100
					? `${post.content.slice(0, 100)}...`
					: post.content;
			default:
				return post.content;
		}
	}

	const PinnedChip = () => (
		// @ts-ignore
		<Chip className="bg-success" size="sm">
			<div className="flex gap-x-2 items-center">
				<ArrowUpOnSquareStackIcon className="h-5 w-5" />
			</div>
		</Chip>
	);

	const ApprovedChip = () => (
		<Tooltip content={"Moderadores deste grupo aprovaram este post."}>
			{/* @ts-ignore */}
			<Chip className="bg-primary text-secondary px-0" size="sm">
				<ShieldCheckIcon className="h-5 w-5" />
			</Chip>
		</Tooltip>
	);

	return (
		<div
			className="relative w-full flex flex-col gap-y-4 px-4 sm:px-6"
			id={`post-${post.id}`}
		>
			{!disableLink && (
				<div className="absolute bg-transparent w-full h-full max-w-[970px] pt-10">
					<Link href={`/post/${post.id}`} className="w-full h-full" />
				</div>
			)}
			<div className="w-full justify-between flex items-start">
				{/* Author */}
				<div className="flex gap-x-4 items-center">
					<Link href={`/user/${post.author.username}`}>
						<UserAvatar avatarURL={post.author.image} />
					</Link>
					<div className="flex flex-col gap-y-1">
						<div className="flex items-center gap-x-2">
							<Link href={`/user/${post.author.username}`}>
								<b>{post.author.username}</b>
							</Link>
							<PrettyDate date={post.createdAt} />

							<p className="second-foreground">
								{" · "}
								{post._count.postView} view
								{post._count.postView > 1 && "s"}
							</p>
						</div>
						<div className="flex gap-x-2 items-center">
							<Link href={`/group/${post.group.groupname}`}>
								<Chip
									className="bg-background border-default p-0 px-0"
									startContent={
										<Image
											as={NextImage}
											removeWrapper={true}
											src={
												post.group.image
													? `${post.group.image}?size=50`
													: "/brand/default-group.svg"
											}
											className="w-6 h-6"
										/>
									}
								>
									<p className="pl-1">
										g/{post.group.groupname}
									</p>
								</Chip>
							</Link>
						</div>
					</div>
				</div>
				<div className="flex gap-x-4">
					<BookmarkPost
						isBookmarked={post.bookmarks.length >= 1}
						postId={post.id}
						defaultBookarkAmmount={post._count.bookmarks}
					/>
					<PostDropdown post={post} isUserPage={isUserPage} />
				</div>
			</div>
			<div className="ml-14 flex flex-col gap-y-4">
				{/* Content */}
				<div className="max-w-[100%]">
					<h2
						style={{ wordWrap: "break-word" }}
						className="max-w-[100%]"
					>
						{post.title}
					</h2>
					<div
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: renderContent() }}
						style={{ wordWrap: "break-word" }}
						className="max-w-[100%]"
					/>
				</div>
				{/* Document */}
				{post.PostDocument && post.PostDocument.length > 0 ? (
					<div className="flex gap-x-2">
						{post.PostDocument.map((doc, index) => {
							return (
								<Link key={doc.id} href={doc.url}>
									<Chip className="bg-background border-default p-0 px-0">
										<div className="flex gap-x-2">
											<DocumentIcon className="h-4 w-4" />
											<p>{doc.name}</p>
										</div>
									</Chip>
								</Link>
							);
						})}
					</div>
				) : (
					""
				)}
				{/* Image */}
				{post.media && !disableImages && post.media.length > 0 ? (
					<Link
						onClick={() => {
							openCarousel(post.media, mediaIndex);
						}}
					>
						<MediaDisplayPost
							setIndex={(i) => setMediaIndex(i)}
							media={post.media}
							index={mediaIndex}
						/>
					</Link>
				) : (
					""
				)}
				{(post.pinned || post.approved) && !isUserPage && (
					<div className="flex gap-x-2">
						{post.pinned && !isUserPage && <PinnedChip />}
						{post.approved && !isUserPage && <ApprovedChip />}
					</div>
				)}
				{!disableComments && post.comments.length > 0 && (
					<div className="flex gap-x-3 items-center">
						<div className="flex">
							{post.comments.slice(-3).map((c, i) => (
								<div key={i} className="-ml-1">
									<Image
										as={NextImage}
										src={
											c.author.image ||
											"/brand/default-avatar.svg"
										}
										removeWrapper={true}
										className="w-6 h-6 background-outline"
									/>
								</div>
							))}
						</div>
						<div>
							{post._count.comments > 3 && (
								<p className="text-tiny">
									e mais {post._count.comments - 3} pessoa
									{post._count.comments - 3 > 1
										? "s"
										: ""}{" "}
									comentaram
								</p>
							)}
							{post._count.comments <= 3 &&
								post._count.comments > 0 && (
									<p className="text-tiny">comentaram</p>
								)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
