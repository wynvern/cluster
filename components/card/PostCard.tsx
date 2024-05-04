import type Post from "@/lib/db/post/type";
import {
	ArrowUpOnSquareStackIcon,
	BookmarkIcon,
	DocumentIcon,
} from "@heroicons/react/24/outline";
import { Button, Chip, Image, Link } from "@nextui-org/react";
import PostDropdown from "../post/PostDropdown";

export default function PostCard({ post }: { post: Post }) {
	return (
		<div className="w-full flex flex-col gap-y-4">
			<div className="w-full justify-between flex items-center">
				{/* Author */}
				<div className="flex gap-x-4 items-center">
					<Image
						src={post.author.image}
						removeWrapper={true}
						className="h-10 sm:h-12 rounded-full"
					/>
					<div>
						<div className="flex items-center">
							<b>{post.author.username}</b>
							{post.pinned && (
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
						<p>{post.group.groupname}</p>
					</div>
				</div>
				<div className="flex gap-x-4">
					<Button
						color="secondary"
						className="default-border"
						isIconOnly={true}
					>
						<BookmarkIcon className="h-6 w-6" />
					</Button>
					<PostDropdown post={post} />
				</div>
			</div>
			<div className="ml-16 flex flex-col gap-y-4 mb-10">
				{/* Content */}
				<div>
					<h2>{post.title}</h2>
					<p>{post.content}</p>
				</div>
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
				{post.media && post.media.length > 0 ? (
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
