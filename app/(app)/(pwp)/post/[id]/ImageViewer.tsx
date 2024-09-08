"use client";

import { useImageCarousel } from "@/providers/ImageDisplay";
import { Image, Link } from "@nextui-org/react";

interface ImageViewerProps {
	media: string[];
}

export default function ({ media }: ImageViewerProps) {
	const { openCarousel } = useImageCarousel();

	return (
		<div>
			{media.length > 0 ? (
				<Link onClick={() => openCarousel(media)}>
					<Image
						src={media[0]}
						removeWrapper={true}
						className="w-full h-auto rounded-none max-h-[80vh]"
					/>
				</Link>
			) : (
				""
			)}
		</div>
	);
}
