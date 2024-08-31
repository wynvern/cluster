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
import prettyDate from "@/util/prettyDate";
import { useImageCarousel } from "@/providers/ImageDisplay";
// @ts-ignore
import { Image as NextImage } from "next/image";

export default function PostCard({
	post,
	isUserPage = false,
	disableLink = false,
	disableImages = false,
	disableComments = false,
}: {
	post: Post;
	disableImages?: boolean;
	isUserPage?: boolean;
	disableLink?: boolean;
	disableComments?: boolean;
}) {
	const [mediaIndex, setMediaIndex] = useState(0);
	const { openCarousel } = useImageCarousel();

	return (
		<div className="w-full flex flex-col gap-y-4 px-4 sm:px-6">
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
							<Tooltip
								content={new Date(
									post.createdAt
								).toLocaleString()}
							>
								<p
									className="second-foreground"
									suppressHydrationWarning
								>
									{prettyDate({ date: post.createdAt })}
								</p>
							</Tooltip>
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
				{disableLink ? (
					<div className="max-w-[100%]">
						<h2
							style={{ wordWrap: "break-word" }}
							className="max-w-[100%]"
						>
							{post.title}
						</h2>
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
							dangerouslySetInnerHTML={{ __html: post.content }}
							style={{ wordWrap: "break-word" }}
							className="max-w-[100%]"
						/>
					</div>
				) : (
					<Link href={`/post/${post.id}`}>
						<div className="max-w-[100%]">
							<h2
								style={{ wordWrap: "break-word" }}
								className="max-w-[100%]"
							>
								{post.title}
							</h2>
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
								dangerouslySetInnerHTML={{
									__html: post.content,
								}}
								style={{ wordWrap: "break-word" }}
								className="max-w-[100%]"
							/>
						</div>
					</Link>
				)}
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
				{post.pinned ||
					(post.approved && (
						<div className="flex gap-x-2">
							{post.pinned && !isUserPage && (
								// @ts-ignore
								<Chip className="bg-success" size="sm">
									<div className="flex gap-x-2 items-center">
										<ArrowUpOnSquareStackIcon className="h-5 w-5" />
									</div>
								</Chip>
							)}
							{post.approved && !isUserPage && (
								<Tooltip
									content={
										"Moderadores deste grupo aprovaram este post."
									}
								>
									<Chip
										className="bg-primary text-secondary px-0"
										// @ts-ignore
										size="sm"
									>
										<ShieldCheckIcon className="h-5 w-5" />
									</Chip>
								</Tooltip>
							)}
						</div>
					))}
				{!disableComments && (
					<div className="flex gap-x-3 items-center">
						<div className="flex">
							{post.comments.map((c, i) => (
								<div key={c.author.username} className="-ml-1">
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
