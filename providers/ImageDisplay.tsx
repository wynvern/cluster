import { createContext, type ReactNode, useContext, useState } from "react";
import BaseModal from "@/components/modal/BaseModal";
import { Button, Image } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ImageCarouselContextType {
	openCarousel: (images: string[], currentIndex?: number) => void;
}

const ImageCarouselContext = createContext<
	ImageCarouselContextType | undefined
>(undefined);

export function ImageCarouselProvider({ children }: { children: ReactNode }) {
	const [images, setImages] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [index, setIndex] = useState(0);

	const openCarousel = (images: string[], currentIndex?: number) => {
		setIndex(currentIndex || 0);
		setImages(images);
		setIsOpen(true);
	};

	const closeCarousel = () => setIsOpen(false);

	return (
		<ImageCarouselContext.Provider value={{ openCarousel }}>
			{children}
			{isOpen && (
				<BaseModal
					active={isOpen}
					setActive={closeCarousel}
					title=""
					size="full"
					body={
						<div className="flex items-center justify-center h-full">
							<div
								className="absolute w-full h-full"
								onClick={closeCarousel}
								onKeyDown={closeCarousel}
							/>
							<div
								className="absolute left-0 p-10"
								style={{ zIndex: "999999999999" }}
							>
								<Button
									isDisabled={index === 0}
									isIconOnly={true}
									variant="bordered"
									className="bg-background"
									onClick={() => setIndex(index - 1)}
								>
									<ChevronLeftIcon className="h-6" />
								</Button>
							</div>
							<div
								className="absolute p-10"
								style={{ zIndex: "999999999999", right: "0" }}
							>
								<Button
									isIconOnly={true}
									variant="bordered"
									className="bg-background"
									isDisabled={index === images.length - 1}
									onClick={() => setIndex(index + 1)}
								>
									<ChevronRightIcon className="h-6" />
								</Button>
							</div>
							<div className="max-h-[40vh]">
								{/* TODO: Fix image height not being correctly placed */}
								<Image
									className="rounded-none h-full"
									removeWrapper={true}
									src={images[index]}
									alt="Image"
								/>
							</div>
							<div className="absolute bottom-0 p-10 flex gap-x-2">
								{images.map((i, _) => (
									<div
										style={{ zIndex: "99999999999999999" }}
										className={`h-1 w-12 rounded-large ${
											_ === index
												? "bg-foreground"
												: "bg-background"
										}`}
										onClick={() => setIndex(_)}
										onKeyDown={() => setIndex(_)}
										key={i}
									/>
								))}
							</div>
						</div>
					}
					extraProps={{
						classNames: {
							base: "bg-transparent flex items-center justify-center h-dvh",
						},
					}}
				/>
			)}
		</ImageCarouselContext.Provider>
	);
}

export function useImageCarousel() {
	const context = useContext(ImageCarouselContext);
	if (!context) {
		throw new Error(
			"useImageCarousel must be used within a ImageCarouselProvider"
		);
	}
	return context;
}
