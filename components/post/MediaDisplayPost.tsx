import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button, Image } from "@nextui-org/react";
// @ts-ignore
import { Image as NextImage } from "next/image";

export default function MediaDisplayPost({
	media,
	index,
	setIndex,
}: {
	media: string[];
	index: number;
	setIndex: (index: number) => void;
}) {
	const extension = media[index].split("/").slice(-2, -1)[0];
	const currentMedia = media[index];

	const renderMedia = () => {
		switch (extension) {
			default:
				return;
		}
	};

	return (
		<div className="relative w-full message-action-container">
			<div className="absolute left-10 top-0 z-50 flex items-center h-full">
				<Button
					isIconOnly={true}
					color="secondary"
					onClick={() => setIndex(index - 1)}
					disabled={index === 0}
					className={`border-default ${
						index === 0 ? "hidden" : ""
					} message-actions`}
				>
					<ChevronLeftIcon className="h-6" />
				</Button>
			</div>
			<div className="absolute right-10 top-0 z-50 flex items-center h-full">
				<Button
					isIconOnly={true}
					color="secondary"
					onClick={() => setIndex(index + 1)}
					disabled={index === media.length - 1}
					className={`border-default ${
						index === media.length - 1 ? "hidden" : ""
					} message-actions`}
				>
					<ChevronRightIcon className="h-6" />
				</Button>
			</div>
			<div
				className="w-full h-auto bg-red flex rounded-large items-center justify-center max-h-[500px]"
				style={{ aspectRatio: "1000 / 500", overflow: "hidden" }}
			>
				<Image
					src={`${currentMedia}`}
					as={NextImage}
					className={
						"h-full w-full object-cover absolute rounded-large"
					}
					alt=""
					removeWrapper={true}
					style={{ zIndex: 5, filter: "brightness(74%)" }}
				/>
				<div
					className="absolute w-full h-full rounded-large"
					style={{ zIndex: 6, backdropFilter: "blur(13px)" }}
				/>
				<Image
					as={NextImage}
					src={`${currentMedia}?size=500`}
					className={"rounded-none max-h-full h-full object-contain"}
					alt=""
					style={{ zIndex: 7 }}
					removeWrapper={true}
				/>
			</div>
		</div>
	);
}
