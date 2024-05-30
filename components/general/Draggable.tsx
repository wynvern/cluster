import {
	type ReactElement,
	cloneElement,
	isValidElement,
	useState,
	useEffect,
} from "react";

interface DraggableProps {
	children: React.ReactNode;
	onFileDrag: (file: {
		base64: string;
		preview: string;
		file: File;
		fileType: string;
	}) => void;
	acceptedTypes?: string[];
	maxSize?: number;
}

interface DraggableElementProps {
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
	onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
	className?: string;
	style?: React.CSSProperties;
}

export default function Draggable({
	children,
	onFileDrag,
	acceptedTypes = ["jpg", "png", "gif", "webp", "jpeg"],
	maxSize = 4.5,
}: DraggableProps) {
	const [dragging, setDragging] = useState(false);
	const [error, setError] = useState(false);

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(false);
	};

	async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setDragging(false);

		const files = Array.from(event.dataTransfer.files).filter((file) =>
			acceptedTypes.includes(file.type.split("/")[1])
		);

		if (files.some((file) => file.size > maxSize * 1024 * 1024)) {
			setError(true);
			return;
		}

		if (files.length > 0) {
			const imagePreview = await toImagePreview(files);
			onFileDrag(imagePreview);
		} else {
			setError(true);
		}
	}

	useEffect(() => {
		if (error) setTimeout(() => setError(false), 2000);
	}, [error]);

	function toImagePreview(
		files: File[]
	): Promise<{
		base64: string;
		preview: string;
		file: File;
		fileType: string;
	}> {
		return new Promise((resolve, reject) => {
			const file = files[0];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				resolve({
					base64: reader.result as string,
					file: file,
					fileType: file.type,
					preview: URL.createObjectURL(file),
				});
			};
			reader.onerror = (error) => {
				setError(true);
				reject(error);
			};
		});
	}

	if (isValidElement<DraggableElementProps>(children)) {
		const childWithProps = cloneElement(children, {
			onDragOver: handleDragOver,
			onDragLeave: handleDragLeave,
			onDrop: handleDrop,
			className: `${children.props.className} rounded-large transition-all duration-200`,
			style: dragging
				? { outline: "4px solid #17C964", outlineOffset: "3px" }
				: error
				? { outline: "4px solid #FF0000", outlineOffset: "3px" }
				: {},
		});

		return <>{childWithProps}</>;
	}

	return null;
}
