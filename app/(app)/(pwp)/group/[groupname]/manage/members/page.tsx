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
import {
	banMember,
	getGroupMembers,
	getMemberRole,
	kickMember,
	promoteMember,
} from "@/lib/db/group/groupMember";
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
	const [role, setRole] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleFetch() {
			const response = await getGroupMembers({
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
				console.log(response, members);
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

	async function handleBanMemeber(member: Member) {
		await confirm({
			onConfirm: async () => {
				const response = await banMember({
					groupname: params.groupname,
					userId: member.user.id,
					reason: "em desenvolvimento", // TODO: ask for a reason.
				});
				console.log(response, members);
				if (response && members) {
					const newMembers = members;
					setMembers(newMembers);
				}
			},
			title: "Banir membro",
			description: `Tem certeza que deseja banir ${member.user.id}?`,
			onCancel: () => {},
		});
	}

	async function handleKickMember(member: Member) {
		await confirm({
			onConfirm: async () => {
				const response = await kickMember({
					groupname: params.groupname,
					userId: member.user.id,
				});
				console.log(response, members);
				if (response && members) {
					const newMembers = members;
					setMembers(newMembers);
				}
			},
			title: "Expulsar membro",
			description: `Tem certeza que deseja expulsar ${member.user.id}?`,
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
										{prettyDate({ date: member.joinedAt })}
									</TableCell>
									<TableCell>
										<div className="flex gap-x-2">
											<Button
												isIconOnly={true}
												color="danger"
												isDisabled={
													member.role === "owner" ||
													(member.role ===
														"moderator" &&
														role !== "owner")
												}
												onClick={() =>
													handleBanMemeber(member)
												}
											>
												<NoSymbolIcon className="h-6" />
											</Button>
											<Button
												isIconOnly={true}
												color="danger"
												isDisabled={
													member.role === "owner" ||
													(member.role ===
														"moderator" &&
														role !== "owner")
												}
												onClick={() =>
													handleKickMember(member)
												}
											>
												<XMarkIcon className="h-6" />
											</Button>
											<Button
												isIconOnly={true}
												color="success"
												isDisabled={
													member.role === "owner" ||
													role !== "owner"
												}
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
