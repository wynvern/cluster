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
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import { fetchBlockedUsers, unblockUser } from "@/lib/db/user/user";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/general/PageHeader";

interface BlockedUser {
	id: string;
	name: string | null;
	username: string | null;
	bio: string | null;
	image: string | null;
}

export default function ({ params }: { params: { groupname: string } }) {
	const [users, setUsers] = useState<BlockedUser[] | null>(null);
	const { confirm } = useConfirmationModal();

	useEffect(() => {
		async function handleFetch() {
			const response = await fetchBlockedUsers();
			if (response) setUsers(response);
		}

		handleFetch();
	}, []);

	async function handleUnblockUser(user: BlockedUser) {
		await confirm({
			onConfirm: async () => {
				await unblockUser(user.id);
			},
			title: "Desbloquear usuário",
			description: `Tem certeza que deseja desbloquear ${user.username}?`,
			onCancel: () => {},
		});
	}

	return (
		<div>
			<PageHeader title="Geral" />
			<div className="pt-10 px-4 sm:px-10">
				{users ? (
					<Table>
						<TableHeader>
							<TableColumn>Nome de usuário</TableColumn>
							<TableColumn>Ações</TableColumn>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.username}</TableCell>
									<TableCell>
										<div className="flex gap-x-2">
											<Button
												isIconOnly={true}
												color="danger"
												onClick={() =>
													handleUnblockUser(user)
												}
											>
												<NoSymbolIcon className="h-6" />
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
