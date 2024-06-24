import {
	ExclamationTriangleIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function NoPosts({ message }: { message: string }) {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<div className="flex gap-x-4 items-center text-neutral-500">
				<InformationCircleIcon className="h-10" />
				<p className="font-semibold">{message}</p>
			</div>
		</div>
	);
}
