import type { FileBase64Info } from "@/util/getFile";
import { cloneElement, isValidElement, useState, useEffect } from "react";

interface DraggableProps {
	children: React.ReactNode;
	onFileDrag: (file: FileBase64Info | FileBase64Info[]) => void;
	acceptedTypes: string[];
	maxSize?: number;
	onError?: (message: string) => void;
	bulk?: boolean;
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
	acceptedTypes,
	maxSize = Number.parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || "4.5"),
	onError,
	bulk = false,
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

		const files = Array.from(event.dataTransfer.files).filter((file) => {
			return acceptedTypes.includes(file.name.split(".").pop() || "");
		});

		if (files.some((file) => file.size > maxSize * 1024 * 1024)) {
			setError(true);
			onError?.(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
			return;
		}

		if (files.length > 0) {
			const imagePreviews = await toImagePreviews(files);
			onFileDrag(bulk ? imagePreviews : imagePreviews[0]);
		} else {
			setError(true);
			onError?.("Tipo de arquivo não suportado");
		}
	}

	useEffect(() => {
		if (error) setTimeout(() => setError(false), 3000);
	}, [error]);

	function toImagePreviews(files: File[]): Promise<FileBase64Info[]> {
		return Promise.all(
			files.map((file) => {
				return new Promise<FileBase64Info>((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						if (typeof reader.result === "string") {
							const [, base64] = reader.result.split(",");
							const preview = URL.createObjectURL(file);
							resolve({
								base64,
								preview,
								fileType: file.type,
								file,
							});
						} else {
							reject(new Error("Failed to read file"));
						}
					};
					reader.onerror = () =>
						reject(new Error("Failed to read file"));
				});
			})
		);
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
				: { outline: "0px solid #0000", outlineOffset: "3px" },
		});

		return <>{childWithProps}</>;
	}

	return null;
}
