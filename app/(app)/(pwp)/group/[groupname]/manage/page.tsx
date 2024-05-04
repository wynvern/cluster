"use client";

import { useEffect, useState } from "react";
import SettingCategory from "./SettingCategory";
import SettingsTabs from "./SettingsTabs";
import { useRouter } from "next/navigation";
import { getRole } from "@/lib/db/group/group";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

export default function Settings({
	params,
}: {
	params: { groupname: string };
}) {
	const [activeTab, setActiveTab] = useState("");
	const router = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleGetRole() {
			const role = await getRole({ groupname: params.groupname });
			if (!["owner", "moderator"].includes(String(role))) {
				router.back();
			}
		}

		handleGetRole();
	}, []);

	return (
		<>
			<div className="flex w-full h-full">
				<div className="hidden lg:flex w-full h-full">
					<div className="w-full w-1/4 sidebar-border pt-10">
						<SettingsTabs
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
					</div>
					<div className="w-full w-3/4 px-10 pt-10">
						<SettingCategory
							activeTab={activeTab}
							groupname={params.groupname}
							className="h-full"
						/>
					</div>
				</div>
				<div className="flex lg:hidden w-full h-full flex-col">
					<div className="w-full p-10">
						<Button
							isIconOnly={true}
							color="secondary"
							className="default-border"
						>
							<ChevronLeftIcon className="h-6" />
						</Button>
					</div>
					{activeTab === "" ? (
						<div className="w-full sidebar-border pt-10">
							<SettingsTabs
								activeTab={activeTab}
								setActiveTab={setActiveTab}
							/>
						</div>
					) : (
						<div className="w-full px-10 pt-10">
							<SettingCategory
								activeTab={activeTab}
								groupname={params.groupname}
								className="h-full"
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
