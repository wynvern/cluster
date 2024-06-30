"use client";

import type Post from "@/lib/db/post/type";
import {
	ArrowUpOnSquareStackIcon,
	DocumentIcon,
	ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
	Chip,
	Image,
	Link,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
} from "@nextui-org/react";
import PostDropdown from "../post/PostDropdown";
import BookmarkPost from "../post/BookmarkPost";
import UserAvatar from "../user/UserAvatar";
import UserPopover from "../user/UserPopover";
import { useState } from "react";
import MediaDisplayPost from "../post/MediaDisplayPost";
import PrettyDate from "../general/PrettyDate";
import prettyDate from "@/util/prettyDate";

export default function PostCard({
	post,
	isUserPage = false,
	disableLink = false,
	disableImages = false,
}: {
	post: Post;
	disableImages?: boolean;
	isUserPage?: boolean;
	disableLink?: boolean;
}) {
	const [mediaIndex, setMediaIndex] = useState(0);

	return (
		<div className="w-full flex flex-col gap-y-4 px-6">
			<div className="w-full justify-between flex items-start">
				{/* Author */}
				<div className="flex gap-x-4 items-center">
					<UserAvatar avatarURL={post.author.image} />
					<div className="flex flex-col gap-y-2">
						<div className="flex items-center gap-x-2">
							<Popover className="default-border rounded-large">
								<PopoverTrigger>
									<b>{post.author.username}</b>
								</PopoverTrigger>
								<PopoverContent>
									<UserPopover
										user={post.author}
										groupname={post.group.groupname}
									/>
								</PopoverContent>
							</Popover>
							<Tooltip
								content={new Date(
									post.createdAt
								).toLocaleString()}
							>
								<p>{prettyDate({ date: post.createdAt })}</p>
							</Tooltip>
							{post.pinned && !isUserPage && (
								<Chip className="bg-success">
									<div className="flex gap-x-2 items-center">
										<ArrowUpOnSquareStackIcon className="h-5 w-5" />
										<p>Pinado</p>
									</div>
								</Chip>
							)}
							{post.approved && !isUserPage && (
								<Tooltip
									content={
										"Moderadores deste grupo aprovaram este post."
									}
								>
									<Chip className="bg-primary text-secondary px-0">
										<ShieldCheckIcon className="h-5 w-5" />
									</Chip>
								</Tooltip>
							)}
						</div>
						<Link href={`/group/${post.group.groupname}`}>
							<Chip
								className="bg-background border-default p-0 px-0"
								startContent={
									<Image
										removeWrapper={true}
										src={post.group.image + "?size=50"}
										className="w-6 h-6"
									/>
								}
							>
								<p>{post.group.groupname}</p>
							</Chip>
						</Link>
					</div>
				</div>
				<div className="flex gap-x-4">
					<BookmarkPost
						isBookmarked={post.bookmarks.length >= 1}
						postId={post.id}
					/>
					<PostDropdown post={post} isUserPage={isUserPage} />
				</div>
			</div>
			<div className="ml-16 flex flex-col gap-y-4 mb-10">
				{/* Content */}
				{disableLink ? (
					<div>
						<h2>{post.title}</h2>
						<div
							dangerouslySetInnerHTML={{ __html: post.content }}
						/>
					</div>
				) : (
					<Link href={`/post/${post.id}`}>
						<div>
							<h2>{post.title}</h2>
							<div
								dangerouslySetInnerHTML={{
									__html: post.content,
								}}
							/>
						</div>
					</Link>
				)}
				{/* Document */}
				{post.document && post.document.length > 0 ? (
					<div className="flex gap-x-2">
						{post.document.map((doc, index) => {
							const docName = new URL(doc).pathname
								.split("/")
								.pop();
							if (!docName) return null;
							const docNameWithoutSuffix = docName
								.split("-")
								.slice(0, -1)
								.join("-");
							return (
								<Link key={doc} href={doc}>
									<Chip>
										<div className="flex gap-x-2">
											<DocumentIcon className="h-5 w-5" />
											<p>{docNameWithoutSuffix}</p>
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
					<div>
						<MediaDisplayPost
							setIndex={(i) => setMediaIndex(i)}
							media={post.media}
							index={mediaIndex}
						/>
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
