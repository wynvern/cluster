import type Post from "@/lib/db/post/type";
import {
	ArrowUpOnSquareStackIcon,
	DocumentIcon,
} from "@heroicons/react/24/outline";
import { Chip, Image, Link } from "@nextui-org/react";
import PostDropdown from "../post/PostDropdown";
import BookmarkPost from "../post/BookmarkPost";

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
	console.log(post);

	return (
		<div className="w-full flex flex-col gap-y-4">
			<div className="w-full justify-between flex items-start">
				{/* Author */}
				<div className="flex gap-x-4 items-center">
					<Image
						src={post.author.image || "/brand/default-avatar.svg"}
						removeWrapper={true}
						className="h-10 sm:h-12"
					/>
					<div className="flex flex-col gap-y-2">
						<div className="flex items-center">
							<Link href={`/user/${post.author.username}`}>
								<b>{post.author.username}</b>
							</Link>
							{post.pinned && !isUserPage && (
								<Chip
									size="sm"
									color="success"
									className="ml-4"
								>
									<div className="flex gap-x-2 items-center">
										<ArrowUpOnSquareStackIcon className="h-5 w-5" />
										Pinado
									</div>
								</Chip>
							)}
						</div>
						<Link href={`/group/${post.group.groupname}`}>
							<Chip variant="bordered">
								{post.group.groupname}
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
						<p>{post.content}</p>
					</div>
				) : (
					<Link href={`/post/${post.id}`}>
						<div>
							<h2>{post.title}</h2>
							<p>{post.content}</p>
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
						<Image src={post.media[0]} />
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
