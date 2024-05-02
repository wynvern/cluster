import type Post from "@/lib/db/post/type";
import {
	BookmarkIcon,
	DocumentIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Chip, Image, Link } from "@nextui-org/react";
import { useState } from "react";

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
						<p>
							<b>{post.author.username}</b>
						</p>
						<p>{post.group.groupname}</p>
					</div>
				</div>
				<div className="flex gap-x-4">
					<Link>
						<BookmarkIcon className="h-6 w-6" />
					</Link>
					<Link>
						<EllipsisHorizontalIcon className="h-8 w-8" />
					</Link>
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
