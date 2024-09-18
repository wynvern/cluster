"use client";

import { useEffect, useState } from "react";
import type { GroupSettings } from "@/lib/db/group/type";
import { CircularProgress, Switch } from "@nextui-org/react";
import {
	fetchGroupSettings,
	updateGroupSetting,
} from "@/lib/db/group/groupManagement";
import PageHeader from "@/components/general/PageHeader";

export default function GeneralSettings({
	params,
}: {
	params: { groupname: string };
}) {
	const [groupSettings, setGroupSettings] = useState<GroupSettings | null>(
		null
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function fetchSettings() {
			const settings = await fetchGroupSettings({
				groupname: params.groupname,
			});
			setGroupSettings(settings);
		}

		fetchSettings();
	}, []);

	async function handleUpdateSetting() {
		if (groupSettings)
			await updateGroupSetting({
				groupname: params.groupname,
				memberJoining: groupSettings.memberJoining,
				memberPosting: groupSettings.memberPosting,
				chatEnabled: groupSettings.chatEnabled,
			});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (groupSettings) {
			handleUpdateSetting();
		}
	}, [groupSettings]);

	return (
		<div>
			<PageHeader title="Geral" />
			{groupSettings ? (
				<>
					<div className="flex items-center justify-between bottom-border px-4 sm:px-10 py-4">
						<div>
							<h2>Membros podem postar</h2>
							<p className="font-normal">
								Esta configuração permite que membros possam
								criar posts dentro do grupo.
							</p>
						</div>
						<div>
							<Switch
								// @ts-ignore
								onValueChange={(selected: boolean) => {
									setGroupSettings({
										...groupSettings,
										memberPosting: selected,
									});
								}}
								isSelected={
									groupSettings?.memberPosting || false
								}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between bottom-border px-4 sm:px-10 py-4">
						<div>
							<h2>Membros podem entrar</h2>
							<p className="font-normal">
								Esta configuração permite que membros possam
								entrar no grupo. Quando desabilitado, os membros
								presentes continuam.
							</p>
						</div>
						<div>
							<Switch
								// @ts-ignore
								onValueChange={(selected: boolean) => {
									setGroupSettings({
										...groupSettings,
										memberJoining: selected,
									});
								}}
								isSelected={
									groupSettings?.memberJoining || false
								}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between bottom-border px-4 sm:px-10 py-4">
						<div>
							<h2>Membros podem utilizar o Chat</h2>
							<p className="font-normal">
								Esta configuração permite que membros possam
								utilizar o chat do grupo.
							</p>
						</div>
						<div>
							<Switch
								// @ts-ignore
								onValueChange={(selected: boolean) => {
									setGroupSettings({
										...groupSettings,
										chatEnabled: selected,
									});
									console.log(selected);
								}}
								isSelected={groupSettings?.chatEnabled || false}
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
