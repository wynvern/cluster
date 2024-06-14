"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function () {
	const router = useRouter();

	return (
		<Button
			variant="bordered"
			onClick={() => router.back()}
			isIconOnly={true}
		>
			<ChevronLeftIcon className="h-6" />
		</Button>
	);
}
