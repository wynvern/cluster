"use client";

import type Group from "@/lib/db/group/type";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function GroupHeader({ group }: { group: Group | null }) {
	const router = useRouter();
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setHasScrolled(currentScrollY > 100); // Change 100 to the amount you want
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="sticky relative top-0 z-50 w-full">
			<div
				className={`absolute h-20 w-full transition-background duration-200 ${
					hasScrolled ? "bg-background bottom-border" : ""
				}`}
			>
				<div className="flex items-center h-full">
					<Button
						isIconOnly={true}
						color="secondary"
						className="ml-4 sm:ml-10 border-default"
						onClick={() => router.back()}
					>
						<ArrowLeftIcon className="h-6" />
					</Button>
					{hasScrolled && group && (
						<div className="ml-4">
							<h3>{group.groupname}</h3>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
