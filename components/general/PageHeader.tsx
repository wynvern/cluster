"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ({
	title,
	showBackButton,
}: {
	title: string;
	showBackButton?: boolean;
}) {
	const router = useRouter();

	return (
		<div className="pt-6 px-4 pb-6 flex gap-x-4 items-center">
			{showBackButton && (
				<Button
					onClick={() => router.back()}
					isIconOnly={true}
					variant="bordered"
					startContent={<ChevronLeftIcon className="h-6" />}
				/>
			)}
			<h2>{title}</h2>
		</div>
	);
}
