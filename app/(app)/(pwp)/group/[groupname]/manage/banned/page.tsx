"use client";

import { useEffect, useState } from "react";
import CategoryHeader from "../CategoryHeader";
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
import prettyDate from "@/util/prettyDate";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
	getBannedGroupMembers,
	getMemberRole,
	unbanMember,
} from "@/lib/db/group/groupMember";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import type { BannedMember } from "@/lib/db/group/type";

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
			description: `Tem certeza que deseja desbanir ${member.user.id}?`,
			onCancel: () => {},
		});
	}

	return (
		<div>
			<CategoryHeader title="Geral" />
			<div className="pt-10 px-4 sm:px-10">
				{members ? (
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
									<TableCell>
										{member.user.username}
									</TableCell>
									<TableCell>{member.reason}</TableCell>
									<TableCell>
										{prettyDate({ date: member.bannedAt })}
									</TableCell>
									<TableCell>
										<div className="flex gap-x-2">
											<Button
												isIconOnly={true}
												color="danger"
												onClick={() =>
													handleUnbanMember(member)
												}
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
					<div>
						<CircularProgress />
					</div>
				)}
			</div>
		</div>
	);
}
