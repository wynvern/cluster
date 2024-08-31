import { Tooltip, Chip, Button } from "@nextui-org/react";
import Link from "next/link";
import UserAvatar from "../user/UserAvatar";
import type RecursiveComments from "@/lib/db/post/comment/type";
import PrettyDate from "@/util/prettyDate";
import {
	ChatBubbleBottomCenterIcon,
	DocumentIcon,
} from "@heroicons/react/24/outline";

interface commentCommentProps {
	comment: RecursiveComments;
	setReplyActive: (active: boolean) => void;
}

export default function ({ comment, setReplyActive }: commentCommentProps) {
	return (
		<div className="w-full flex flex-col">
			<div className="w-full justify-between flex items-start">
				{/* Author */}
				<div className="flex gap-x-4 items-start">
					<UserAvatar size="10" avatarURL={comment.author.image} />
					<div className="flex flex-col">
						<div className="flex items-center">
							<p>
								<b>{comment.author.username}</b>{" "}
								<Tooltip
									content={new Date(
										comment.createdAt
									).toLocaleString()}
								>
									<p>
										{new Date(
											comment.createdAt
										).toLocaleString()}
									</p>
								</Tooltip>
							</p>
						</div>
						<div>
							<p>{comment.text}</p>
						</div>
					</div>
				</div>
				<div className="flex gap-x-4">
					<Button
						isIconOnly={true}
						onClick={() => setReplyActive(true)}
						variant="bordered"
						size="sm"
						className="p-1"
					>
						<ChatBubbleBottomCenterIcon className="h-6" />
					</Button>
				</div>
			</div>
			<div className="ml-16 flex flex-col">
				{/* Document */}
				{comment.document && comment.document.length > 0 ? (
					<div className="flex gap-x-2">
						{comment.document.map((doc, index) => {
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
				{comment.media && comment.media.length > 0 ? (
					<div>
						<p>temp</p>
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
