import type Post from "@/lib/db/post/type";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { Chip, Image, Skeleton } from "@nextui-org/react";
import Link from "next/link";

export default function SkeletonPostCard() {
	return (
		<div className="w-full flex flex-col gap-y-4">
			<div>
				{/* Author */}
				<div className="flex gap-x-4">
					<Skeleton className="rounded-large">
						<Image
							src={""}
							removeWrapper={true}
							isLoading={true}
							className="h-12 w-12 rounded-full"
						/>
					</Skeleton>
					<div className="flex flex-col gap-y-2">
						<Skeleton className="rounded-large">
							<p>
								<b>testetestetesteteste</b>
							</p>
						</Skeleton>
						<Skeleton className="rounded-large">
							<p>testetestet</p>
						</Skeleton>
					</div>
				</div>
			</div>
			<div className="ml-16 flex flex-col gap-y-6 mb-10">
				{/* Content */}
				<div className="flex flex-col gap-y-2">
					<Skeleton className="rounded-large">
						<h1>
							<b>teste</b>
						</h1>
					</Skeleton>
					<Skeleton className="rounded-large">
						<p className="break-all">
							testetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetestetesteteste
						</p>
					</Skeleton>
				</div>
			</div>
		</div>
	);
}
