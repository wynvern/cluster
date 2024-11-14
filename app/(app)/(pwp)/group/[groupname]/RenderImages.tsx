"use client";

import type Group from "@/lib/db/group/type";
import { useImageCarousel } from "@/providers/ImageDisplay";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

export default function RenderImages({ group }: { group: Group }) {
	const { openCarousel } = useImageCarousel();

	return (
		<>
			<Image
				onClick={() => {
					if (group?.banner) openCarousel([group.banner]);
				}}
				src={group ? `${group.banner as string}?size=550` : ""}
				removeWrapper={true}
				className="rounded-none w-full h-full object-cover"
			/>
			<div className="absolute -bottom-20 left-4 sm:left-10 bg-neutral-800 rounded-large">
				<Image
					onClick={() => {
						if (group?.image) openCarousel([group.image]);
					}}
					src={
						group?.image
							? `${group.image}?size=400`
							: "/brand/default-group.svg"
					}
					removeWrapper={false}
					className="h-[100px] sm:h-60 object-cover aspect-square"
				/>
			</div>
		</>
	);
}
