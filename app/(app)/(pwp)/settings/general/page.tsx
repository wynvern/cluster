"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Switch } from "@nextui-org/react";
import { fetchUserSettings, updateUserSettings } from "@/lib/db/user/user";
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

export default function GeneralSettings({
	params,
}: {
	params: { groupname: string };
}) {
	const [settings, setSettings] = useState<settings | null>(null);

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
				privateProfile: settings.privateProfile,
				privateBookmarks: settings.privateBookmarks,
				privateGroups: settings.privateGroups,
				disableNotifications: settings.disableNotifications,
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
							<h2>Perfil privado</h2>
							<p className="font-normal">
								Esta configuração faz com que seu perfil seja
								invisível, onde nenhum usuário, exceto
								moderadores dos grupos em que participa, possam
								ver o seu perfil.
							</p>
						</div>
						<div>
							<Switch
								// @ts-ignore
								onValueChange={(selected: boolean) => {
									setSettings({
										...settings,
										privateProfile: selected,
									});
								}}
								isSelected={settings?.privateProfile || false}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between bottom-border px-4 sm:px-10 py-4">
						<div>
							<h2>Salvos privados</h2>
							<p className="font-normal">
								Quando habilitado, nenhum usuário poderá ver os
								posts que você salvar, porém o contador
								continuará a mostrar.
							</p>
						</div>
						<div>
							<Switch
								// @ts-ignore
								onValueChange={(selected: boolean) => {
									setSettings({
										...settings,
										privateBookmarks: selected,
									});
								}}
								isSelected={settings?.privateBookmarks || false}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between bottom-border px-4 sm:px-10 py-4">
						<div>
							<h2>Grupos privados</h2>
							<p className="font-normal">
								Quando habilitado, nenhum usuário poderá ver em
								quais grupos você está, exceto os moderadores
								dos mesmos.
							</p>
						</div>
						<div>
							<Switch
								// @ts-ignore
								onValueChange={(selected: boolean) => {
									setSettings({
										...settings,
										privateGroups: selected,
									});
								}}
								isSelected={settings?.privateGroups || false}
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
