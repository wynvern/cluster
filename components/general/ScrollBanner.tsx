"use client";

import { useEffect, useRef } from "react";

export default function ScrollBanner({ imageURL }: { imageURL: string }) {
	const bannerRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			const { current } = bannerRef;
			if (current) {
				const topBarHeight = 50; // Example top bar height
				const offset =
					window.pageYOffset - topBarHeight > 0
						? window.pageYOffset - topBarHeight
						: 0;
				const speed = 0.6; // Adjust speed as needed
				// Change the calculation here to correct the direction
				current.style.backgroundPositionY = `${offset * speed}px`;
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			ref={bannerRef}
			style={{
				backgroundImage: `url(${imageURL})`,
				height: "400px", // Ensure the div's height is 400px
				width: "1000px", // Ensure the div's width is 1000px
				backgroundAttachment: "scroll", // Change to scroll to move with the page
				backgroundPosition: "center top", // Center the background image and align to the top
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover", // Ensure the background image covers the entire div
			}}
		/>
	);
}
