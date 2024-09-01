"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ({
	title,
	showBackButton,
	className,
	enableHeightUsage = true,
	children,
	isFixed = true,
}: {
	title: string;
	showBackButton?: boolean;
	className?: string;
	enableHeightUsage?: boolean;
	children?: React.ReactNode;
	isFixed?: boolean;
}) {
	const router = useRouter();
	const [blur, setBlur] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setBlur(10);
			} else {
				setBlur(0);
			}
		};

		window.addEventListener("scroll", handleScroll);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			{enableHeightUsage && <div className="h-16" />}

			<div
				style={{
					backdropFilter: `blur(${blur}px)`,
				}}
				className={`${className} ${
					isFixed && "fixed"
				} top-0 pt-4 px-4 pb-4 w-full max-w-[1000px] flex gap-x-4 items-center z-40`}
			>
				{children}
				{showBackButton && (
					<Button
						className="bg-background"
						onClick={() => router.back()}
						isIconOnly={true}
						variant="bordered"
						size="sm"
						startContent={<ChevronLeftIcon className="h-6" />}
					/>
				)}
				<b>{title}</b>
			</div>
		</>
	);
}
