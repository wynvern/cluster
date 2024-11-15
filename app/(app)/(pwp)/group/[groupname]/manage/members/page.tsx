"use client";

import { useEffect, useState } from "react";
import {
	Button,
	CircularProgress,
	Link,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import {
	ChevronDownIcon,
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
	unpromoteMember,
} from "@/lib/db/group/groupMember";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import PrettyDate from "@/components/general/PrettyDate";
import PageHeader from "@/components/general/PageHeader";

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
				if (response && members) {
					const newMembers = members;
					const index = members.findIndex((m) => m.user.id === member.user.id);
					newMembers[index].role = "moderator";
					setMembers(newMembers);
				}
			},
			title: "Promover membro",
			description: `Tem certeza que deseja promover ${member.user.username} a moderador?`,
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

				if (response && members) {
					const newMembers = members;
					setMembers(newMembers);
				}
			},
			title: "Banir membro",
			description: `Tem certeza que deseja banir ${member.user.username}?`,
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

	async function handleUnpromoteMember(member: Member) {
		await confirm({
			onConfirm: async () => {
				const response = await unpromoteMember({
					groupname: params.groupname,
					userId: member.user.id,
				});
				if (response && members) {
					const index = members.findIndex((m) => m.user.id === member.user.id);
					const newMembers = members;
					newMembers[index].role = "member";
					setMembers(newMembers);
				}
			},
			title: "Despromover membro",
			description: `Tem certeza que deseja despromover ${member.user.username}?`,
			onCancel: () => {},
		});
	}

	return (
		<div>
			<PageHeader title="Membros" />
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
										<Link href={`/user/${member.user.username}`}>
											{member.user.username}
										</Link>
									</TableCell>
									<TableCell>{rolesDictionary[member.role]}</TableCell>
									<TableCell>
										<PrettyDate date={member.joinedAt} />
									</TableCell>
									<TableCell>
										<div className="flex gap-x-2">
											<Button
												isIconOnly={true}
												color="danger"
												isDisabled={
													member.role === "owner" ||
													(member.role === "moderator" && role !== "owner")
												}
												onClick={() => handleBanMemeber(member)}
											>
												<NoSymbolIcon className="h-6" />
											</Button>
											<Button
												isIconOnly={true}
												color="danger"
												isDisabled={
													member.role === "owner" ||
													(member.role === "moderator" && role !== "owner")
												}
												onClick={() => handleKickMember(member)}
											>
												<XMarkIcon className="h-6" />
											</Button>
											{member.role === "member" ? (
												<Button
													isIconOnly={true}
													color="success"
													onClick={() => handlePromoteMember(member)}
												>
													<ChevronUpIcon className="h-6" />
												</Button>
											) : (
												<Button
													isIconOnly={true}
													color="success"
													isDisabled={member.role === "owner"}
													onClick={() => handleUnpromoteMember(member)}
												>
													<ChevronDownIcon className="h-6" />
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="flex w-full h-40 items-center justify-center">
						<CircularProgress />
					</div>
				)}
			</div>
		</div>
	);
}
