import { bookmarkPost, unbookmarkPost } from "@/lib/db/post/post";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookarmkIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function BookmarkPost({
	isBookmarked,
	postId,
	defaultBookarkAmmount,
}: {
	isBookmarked: boolean;
	postId: string;
	defaultBookarkAmmount?: number;
}) {
	const [bookmarked, setBookmarked] = useState(isBookmarked);
	const [bookmarkAmmount, setBookmarkAmmount] = useState(
		defaultBookarkAmmount || 0
	);

	async function handleBookmark() {
		if (bookmarked) {
			// Remove bookmark
			await unbookmarkPost(postId);
			setBookmarkAmmount((prev) => prev - 1);
		} else {
			// Add bookmark
			await bookmarkPost(postId);
			toast.info("Post salvo em seus favoritos", {
				autoClose: 3000,
				icon: <SolidBookarmkIcon className="h-6" />,
			});
			setBookmarkAmmount((prev) => prev + 1);
		}

		setBookmarked(!bookmarked);
	}

	return (
		<Button
			size="sm"
			variant="bordered"
			className="p-1"
			onClick={handleBookmark}
			isIconOnly={bookmarkAmmount < 1}
		>
			{bookmarked ? (
				<SolidBookarmkIcon className="h-6" />
			) : (
				<BookmarkIcon className="h-6" />
			)}
			{bookmarkAmmount > 0 && bookmarkAmmount}
		</Button>
	);
}
