"use client";

import { useEffect, useState } from "react";
import {
	Button,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
	getBannedGroupMembers,
	getMemberRole,
	unbanMember,
} from "@/lib/db/group/groupMember";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import type { BannedMember } from "@/lib/db/group/type";
import PrettyDate from "@/components/general/PrettyDate";
import PageHeader from "@/components/general/PageHeader";
import InfoMessage from "@/components/card/InfoMessage";

export default function ({ params }: { params: { groupname: string } }) {
	const [members, setMembers] = useState<BannedMember[] | null>(null);
	const { confirm } = useConfirmationModal();
	const [role, setRole] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleFetch() {
			const response = await getBannedGroupMembers({
				groupname: params.groupname,
			});
			if (response) setMembers(response);

			const userRole = await getMemberRole({
				groupname: params.groupname,
			});
			if (userRole) setRole(userRole);
		}

		handleFetch();
	}, []);

	async function handleUnbanMember(member: BannedMember) {
		await confirm({
			onConfirm: async () => {
				const response = await unbanMember({
					groupname: params.groupname,
					userId: member.user.id,
				});
				if (response && members) {
					const newMembers = members;
					setMembers(newMembers);
				}
			},
			title: "Desbanir membro",
			description: `Tem certeza que deseja desbanir ${member.user.username}?`,
			onCancel: () => {},
		});
	}

	return (
		<div>
			<PageHeader title="Banidos" />
			<div className="pt-10 px-4 sm:px-10">
				{members ? (
					<>
						{members.length > 0 ? (
							<Table>
								<TableHeader>
									<TableColumn>Nome de usuário</TableColumn>
									<TableColumn>Razão</TableColumn>
									<TableColumn>Banido em</TableColumn>
									<TableColumn>Ações</TableColumn>
								</TableHeader>
								<TableBody>
									{members.map((member) => (
										<TableRow key={member.user.id}>
											<TableCell>{member.user.username}</TableCell>
											<TableCell>{member.reason}</TableCell>
											<TableCell>
												<PrettyDate date={member.bannedAt} />
											</TableCell>
											<TableCell>
												<div className="flex gap-x-2">
													<Button
														isIconOnly={true}
														color="danger"
														onClick={() => handleUnbanMember(member)}
													>
														<CheckIcon className="h-6" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<InfoMessage message="Nenhum usuário banido." />
						)}
					</>
				) : (
					<div className="w-full flex items-center justify-center">
						<CircularProgress />
					</div>
				)}
			</div>
		</div>
	);
}
