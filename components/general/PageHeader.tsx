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
	const [activeEffect, setActiveEffect] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setActiveEffect(true);
			} else {
				setActiveEffect(false);
			}
		};

		const handleBeforeUnload = () => {
			window.removeEventListener("scroll", handleScroll);
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("beforeunload", handleBeforeUnload);

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
					backdropFilter: `blur(${activeEffect ? 10 : 0}px)`,
				}}
				className={`${className} ${
					isFixed && "fixed"
				} top-0 pt-4 px-4 pb-4 w-full max-w-[998px] flex gap-x-4 ${
					activeEffect ? "bottom-border" : ""
				} items-center z-40`}
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
