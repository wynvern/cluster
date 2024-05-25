import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

export default function ChatHeader({ groupname }: { groupname: string }) {
	return (
		<>
			<div className="h-20" />
			<div className="h-20 bottom-border flex gap-x-4 items-center px-4 py-4 w-full z-50 fixed bg-background">
				<Button isIconOnly={true} variant="bordered">
					<ChevronLeftIcon className="h-6" />
				</Button>
				<p>{groupname}</p>
			</div>
		</>
	);
}
