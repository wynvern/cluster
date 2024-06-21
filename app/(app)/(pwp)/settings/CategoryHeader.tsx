import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

export default function CategoryHeader({ title }: { title: string }) {
	return (
		<div className="px-4 sm:px-10 flex items-center gap-x-4 bottom-border pb-10">
			<Button
				isIconOnly={true}
				variant="bordered"
				className="flex sm:hidden"
			>
				<ChevronLeftIcon className="h-6" />
			</Button>
			<h2>{title}</h2>
		</div>
	);
}
