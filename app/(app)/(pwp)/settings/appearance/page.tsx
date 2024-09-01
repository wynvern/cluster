"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Switch } from "@nextui-org/react";
import { fetchUserSettings, updateUserSettings } from "@/lib/db/user/user";
import { useTheme } from "next-themes";
import PageHeader from "@/components/general/PageHeader";

interface settings {
	id: string;
	userId: string;
	createdAt: Date;
	privateProfile: boolean;
	privateBookmarks: boolean;
	privateGroups: boolean;
	disableNotifications: boolean;
	theme: "light" | "dark";
}

export default function ({ params }: { params: { groupname: string } }) {
	const [settings, setSettings] = useState<settings | null>(null);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		async function fetchSettings() {
			const settings = await fetchUserSettings();
			setSettings(settings);
		}

		fetchSettings();
	}, []);

	async function handleUpdateSetting() {
		if (settings)
			await updateUserSettings({
				theme: settings.theme,
			});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (settings) {
			handleUpdateSetting();
		}
	}, [settings]);

	return (
		<div>
			<PageHeader title="Geral" />
			{settings ? (
				<>
					<div className="flex items-center justify-between bottom-border px-4 sm:px-10 py-4">
						<div>
							<h2>Tema</h2>
							<p className="font-normal">
								Escolha o tema da aplicação.
							</p>
						</div>
						<div>
							<Switch
								// @ts-ignore
								onValueChange={(selected: boolean) => {
									setSettings({
										...settings,
										theme: selected ? "dark" : "light",
									});
									setTheme(selected ? "dark" : "light");
								}}
								isSelected={
									settings?.theme === "dark"
										? true
										: false || false
								}
							/>
						</div>
					</div>
				</>
			) : (
				<div className="w-full h-20 flex items-center justify-center">
					<CircularProgress />
				</div>
			)}
		</div>
	);
}
