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
import {
	ChevronUpIcon,
	NoSymbolIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { getGroupMembers, promoteMember } from "@/lib/db/group/groupMember";
import { useConfirmationModal } from "@/providers/ConfirmationModal";

interface Member {
	user: {
		id: string;
		name: string | null;
		image: string | null;
		username: string | null;
	};
	role: string;
	joinedAt: Date;
}

export default function ({ params }: { params: { groupname: string } }) {
	const [members, setMembers] = useState<Member[] | null>(null);
	const { confirm } = useConfirmationModal();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleFetch() {
			const response = await getGroupMembers({
				groupname: params.groupname,
			});
			if (response) setMembers(response);
			console.log(response);
		}

		handleFetch();
	}, []);

	const rolesDictionary: Record<string, string> = {
		owner: "Dono",
		member: "Membro",
		moderator: "Moderador",
	};

	async function handlePromoteMember(member: Member) {
		await confirm({
			onConfirm: async () => {
				const response = await promoteMember({
					groupname: params.groupname,
					userId: member.user.id,
				});
				if (response && members) {
					const newMembers = members;
					setMembers(newMembers);
				}
			},
			title: "Promover membro",
			description: `Tem certeza que deseja promover ${member.user.id} a moderador?`,
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
							<TableColumn>Cargo</TableColumn>
							<TableColumn>Entrou em</TableColumn>
							<TableColumn>Ações</TableColumn>
						</TableHeader>
						<TableBody>
							{members.map((member) => (
								<TableRow key={member.user.id}>
									<TableCell>
										{member.user.username}
									</TableCell>
									<TableCell>
										{rolesDictionary[member.role]}
									</TableCell>
									<TableCell>
										{prettyDate(member.joinedAt)}
									</TableCell>
									<TableCell>
										<div className="flex gap-x-2">
											<Button
												isIconOnly={true}
												color="danger"
											>
												<NoSymbolIcon className="h-6" />
											</Button>
											<Button
												isIconOnly={true}
												color="danger"
											>
												<XMarkIcon className="h-6" />
											</Button>
											<Button
												isIconOnly={true}
												color="success"
												onClick={() =>
													handlePromoteMember(member)
												}
											>
												<ChevronUpIcon className="h-6" />
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
