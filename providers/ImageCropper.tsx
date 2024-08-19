import {
	createContext,
	type ReactNode,
	useContext,
	useState,
	useCallback,
	useEffect,
	useRef,
} from "react";
import BaseModal from "@/components/modal/BaseModal";
import { Button } from "@nextui-org/react";
import ReactCropper from "react-cropper";
import Cropper from "react-cropper";

interface ImageCropperContextType {
	cropImage: (image: string, aspectRatio: number) => Promise<boolean>;
}

const ImageCropperContext = createContext<ImageCropperContextType | undefined>(
	undefined
);

export function ImageCropperProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState<string | null>(null);
	const [aspectRatio, setAspectRatio] = useState<number | null>(null);
	const [resolveCallback, setResolveCallback] = useState<
		((value: boolean) => void) | null
	>(null);
	const cropperRef = useRef<HTMLImageElement>(null);

	const cropImage = useCallback((image: string, aspectRatio: number) => {
		setImage(image);
		setAspectRatio(aspectRatio);
		setIsOpen(true);
		return new Promise<boolean>((resolve) => {
			setResolveCallback(() => resolve);
		});
	}, []);

	const closeCropper = () => {
		setIsOpen(false);
		setImage(null);
		setAspectRatio(null);
		setResolveCallback(null);
	};

	const handleApply = () => {
		if (resolveCallback) {
			resolveCallback(true);
		}
		closeCropper();
	};

	const handleCancel = () => {
		if (resolveCallback) {
			resolveCallback(false);
		}
		closeCropper();
	};

	return (
		<ImageCropperContext.Provider value={{ cropImage }}>
			{children}
			{isOpen && (
				<BaseModal
					active={isOpen}
					setActive={handleCancel}
					title="Image Cropper"
					size="2xl"
					body={
						<div>
							<Cropper
								ref={cropperRef}
								src={image || ""}
								guides={true}
							/>
						</div>
					}
					footer={
						<>
							<Button onClick={handleCancel}>Cancelar</Button>
							<Button onClick={handleApply}>Aplicar</Button>
						</>
					}
				/>
			)}
		</ImageCropperContext.Provider>
	);
}

export function useImageCropper() {
	const context = useContext(ImageCropperContext);
	if (context === undefined) {
		throw new Error(
			"useImageCropper must be used within an ImageCropperProvider"
		);
	}
	return context;
}
