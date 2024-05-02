"use client";

import { ChevronRightIcon, CubeIcon } from "@heroicons/react/24/outline";
import { Link, Tab, Tabs } from "@nextui-org/react";

interface SettingsTabsProps {
	className?: string;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const categories = [
	{ title: "Geral", icon: <CubeIcon className="h-6" /> },
	{ title: "Notificações", icon: <CubeIcon className="h-6" /> },
	{ title: "Segurança", icon: <CubeIcon className="h-6" /> },
];

export default function SettingsTabs({
	className,
	activeTab,
	setActiveTab,
}: SettingsTabsProps) {
	return (
		<div className={className}>
			<h2 className="mb-10 ml-4 sm:ml-10">Configurações</h2>
			<div className="flex flex-col gap-y-6">
				{categories.map((category) => (
					<Link
						key={category.title}
						className="flex w-full justify-between bottom-border pb-4 px-4 sm:px-10"
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
