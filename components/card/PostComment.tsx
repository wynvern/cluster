import { Chip, Button } from "@nextui-org/react";
import Link from "next/link";
import UserAvatar from "../user/UserAvatar";
import type RecursiveComments from "@/lib/db/post/comment/type";
import {
	ChatBubbleBottomCenterIcon,
	DocumentIcon,
} from "@heroicons/react/24/outline";
import PrettyDate from "../general/PrettyDate";

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
					<Link href={`/user/${comment.author.username}`}>
						<UserAvatar
							size="10"
							avatarURL={comment.author.image}
						/>
					</Link>
					<div className="flex flex-col">
						<div className="flex items-center gap-x-2">
							<b>
								<Link href={`/user/${comment.author.username}`}>
									{comment.author.username}
								</Link>
							</b>
							<PrettyDate date={comment.createdAt} />
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
			<div className="ml-14">
				<p className="break-all">{comment.text}</p>
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
