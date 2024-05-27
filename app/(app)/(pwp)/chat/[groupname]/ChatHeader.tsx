import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ChatHeader({ groupname }: { groupname: string }) {
	const router = useRouter();

	return (
		<>
			<div className="bottom-border flex gap-x-4 items-center px-4 py-4 w-full z-50 bg-background">
				<Button
					isIconOnly={true}
					variant="bordered"
					onClick={() => router.back()}
				>
					<ChevronLeftIcon className="h-6" />
				</Button>
				<p>{groupname}</p>
			</div>
		</>
	);
}
