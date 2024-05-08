"use client";

import { useState } from "react";
import SettingCategory from "./SettingCategory";
import SettingsTabs from "./SettingsTabs";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

export default function Settings() {
	const [activeTab, setActiveTab] = useState("");

	return (
		<>
			<div className="flex flex-col lg:flex-row w-full h-full">
				<div className="w-full lg:w-1/4 h-full sidebar-border pt-10 hidden lg:block">
					<SettingsTabs
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
				</div>
				{activeTab !== "" && (
					<div className="w-full md:hidden lg:block lg:w-3/4 h-full p-10">
						<div className="mb-10 block md:hidden">
							<Button isIconOnly={true} variant="bordered">
								<ChevronLeftIcon
									className="h-6"
									onClick={() => setActiveTab("")}
								/>
							</Button>
						</div>
						<SettingCategory activeTab={activeTab} />
					</div>
				)}
			</div>
		</>
	);
}
