"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ({
	title,
	showBackButton,
	className,
}: {
	title: string;
	showBackButton?: boolean;
	className?: string;
}) {
	const router = useRouter();

	return (
		<div
			className={`pt-4 px-4 pb-4 flex gap-x-4 items-center ${className}`}
		>
			{showBackButton && (
				<Button
					onClick={() => router.back()}
					isIconOnly={true}
					variant="bordered"
					size="sm"
					startContent={<ChevronLeftIcon className="h-6" />}
				/>
			)}
			<h2>{title}</h2>
		</div>
	);
}
