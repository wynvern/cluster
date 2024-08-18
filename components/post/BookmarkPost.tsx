import { bookmarkPost, unbookmarkPost } from "@/lib/db/post/post";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookarmkIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function BookmarkPost({
	isBookmarked,
	postId,
}: {
	isBookmarked: boolean;
	postId: string;
}) {
	const [bookmarked, setBookmarked] = useState(isBookmarked);

	async function handleBookmark() {
		if (bookmarked) {
			// Remove bookmark
			await unbookmarkPost(postId);
		} else {
			// Add bookmark
			await bookmarkPost(postId);
			toast.info("Post salvo em seus favoritos", {
				autoClose: 3000,
				icon: <SolidBookarmkIcon className="h-6" />,
			});
		}

		setBookmarked(!bookmarked);
	}

	return (
		<Button variant="bordered" isIconOnly={true} onClick={handleBookmark}>
			{bookmarked ? (
				<SolidBookarmkIcon className="h-6" />
			) : (
				<BookmarkIcon className="h-6" />
			)}
		</Button>
	);
}
