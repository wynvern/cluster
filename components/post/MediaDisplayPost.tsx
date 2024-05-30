import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

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

	console.log(currentMedia);

	const renderMedia = () => {
		switch (extension) {
			case "png":
			case "gif":
			case "jpg":
			case "jpeg":
				return (
					<img
						src={currentMedia}
						className={"h-full w-full rounded-large object-cover"}
						alt=""
					/>
				);
			case "mp4":
				return (
					<video controls className={"h-full w-full rounded-large"}>
						<source src={currentMedia} type="video/mp4" />
						<track kind="captions" />
						Your browser does not support the video tag.
					</video>
				);
			default:
				return null;
		}
	};

	return (
		<div className="relative w-full max-h-[50vh] aspect-square message-action-container">
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
			{renderMedia()}
		</div>
	);
}
