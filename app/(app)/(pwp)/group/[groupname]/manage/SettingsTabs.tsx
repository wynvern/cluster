"use client";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	CubeIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button, Link, Tab, Tabs } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface SettingsTabsProps {
	className?: string;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const categories = [
	{ title: "Geral", icon: <CubeIcon className="h-6" /> },
	{ title: "Membros", icon: <UserGroupIcon className="h-6" /> },
];

export default function SettingsTabs({
	className,
	activeTab,
	setActiveTab,
}: SettingsTabsProps) {
	const router = useRouter();

	return (
		<div className={className}>
			<div className="w-full mb-10 ml-10">
				<Button
					isIconOnly={true}
					color="secondary"
					className="default-border"
					onClick={() => router.back()}
				>
					<ChevronLeftIcon className="h-6" />
				</Button>
			</div>
			<h2 className="mb-10 ml-4 sm:ml-10">Gerenciar Grupo</h2>
			<div className="flex flex-col gap-y-6">
				{categories.map((category) => (
					<Link
						key={category.title}
						className={`flex w-full justify-between bottom-border pb-4 px-4 sm:px-10 ${
							category.title === activeTab ? "font-black" : ""
						}`}
						onClick={() => setActiveTab(category.title)}
					>
						<div className="flex gap-x-4 items-center">
							{category.icon}
							<p>{category.title}</p>
						</div>
						<div>
							<ChevronRightIcon className="h-5" />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
