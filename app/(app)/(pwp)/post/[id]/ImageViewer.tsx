import { Image } from "@nextui-org/react";

interface ImageViewerProps {
	media: string[];
}

export default function ({ media }: ImageViewerProps) {
	return (
		<div>
			{media.length > 0 ? (
				<Image
					src={media[0]}
					removeWrapper={true}
					className="w-full h-auto rounded-none"
				/>
			) : (
				""
			)}
		</div>
	);
}
