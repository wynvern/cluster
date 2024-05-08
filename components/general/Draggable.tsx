import {
	ArchiveBoxArrowDownIcon,
	DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface DraggableProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	onFileDrag: (files: File[]) => void;
	acceptedTypes: string[];
	maxSize?: number;
}

export default function Draggable({
	children,
	onFileDrag,
	acceptedTypes,
	maxSize = 4.5,
	className,
	style,
}: DraggableProps) {
	const [dragging, setDragging] = useState(false);

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(false);
		console.log(event.dataTransfer.files);

		const files = Array.from(event.dataTransfer.files).filter((file) =>
			acceptedTypes.includes(file.type.split("/")[1])
		);

		if (files.some((file) => file.size > maxSize * 1024 * 1024)) {
			console.log("File too large");
			return;
		}

		if (files.length > 0) {
			onFileDrag(files);
		}
	};

	return (
		<div
			className={`${className} ${dragging ? "bg-success" : ""} ${
				dragging ? "flex items-center justify-center flex-col" : ""
			} `}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			style={style}
		>
			{dragging ? (
				<div className="h-full w-full">
					<DocumentArrowDownIcon className="h-12 text-white" />
					<p className="text-white font-bold">Arraste Imagens</p>
				</div>
			) : (
				children
			)}
		</div>
	);
}
