import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

export default function ({
	title,
	showBackButton,
}: {
	title: string;
	showBackButton?: boolean;
}) {
	return (
		<div className="pt-6 px-4 pb-6 flex gap-x-4 items-center">
			{showBackButton && (
				<Button
					isIconOnly={true}
					variant="bordered"
					startContent={<ChevronLeftIcon className="h-6" />}
				/>
			)}
			<h2>{title}</h2>
		</div>
	);
}
