"use client";

import { useConfirmationModal } from "@/components/provider/ConfirmationModal";
import UserAvatar from "@/components/user/UserAvatar";
import {
	getMembers,
	promoteMember,
	removeMember,
	unpromoteMember,
} from "@/lib/db/group/group";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	NoSymbolIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	Image,
	TableRow,
	Chip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Members({ groupname }: { groupname: string }) {
	const [members, setMembers] = useState<
		{
			role: "owner" | "moderator" | "member";
			joinedAt: Date;
			user: {
				id: string;
				name: string | null;
				image: string | null;
				username: string | null;
			};
		}[]
	>([]);
	const { confirm } = useConfirmationModal();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function fetchMembers() {
			const data = await getMembers({ groupname });
			if (data) {
				setMembers(data);
			} else {
				setMembers([]);
			}
		}

		fetchMembers();
	}, []);

	async function handleRemoveUser(user: { username: string; id: string }) {
		await confirm({
			title: "Remover usuário",
			description: `Tem certeza que deseja remover ${user.username}?`,
			onConfirm: () => {
				removeMember({ groupname, userId: user.id }).then((data) => {
					if (data === "ok") {
						setMembers((prev) =>
							prev.filter((member) => member.user.id !== user.id)
						);
					}
				});
			},
			onCancel: () => {},
		});
	}

	async function handlePromoteUser(user: { username: string; id: string }) {
		await confirm({
			title: "Promover usuário",
			description: `Tem certa certeza que deseja promover ${user.username}?`,
			onConfirm: () => {
				promoteMember({ groupname, userId: user.id }).then((data) => {
					if (data === "ok") {
						setMembers((prev) =>
							prev.map((member) => {
								if (member.user.id === user.id) {
									member.role = "moderator";
								}
								return member;
							})
						);
					}
				});
			},
			onCancel: () => {},
		});
	}

	async function handleUnpromoteUser(user: { username: string; id: string }) {
		await confirm({
			title: "Despromover usuário",
			description: `Tem certa certeza que deseja despromover ${user.username}?`,
			onConfirm: () => {
				unpromoteMember({ groupname, userId: user.id }).then((data) => {
					if (data === "ok") {
						setMembers((prev) =>
							prev.map((member) => {
								if (member.user.id === user.id) {
									member.role = "member";
								}
								return member;
							})
						);
					}
				});
			},
			onCancel: () => {},
		});
	}

	return (
		<>
			<div className="h-full flex flex-col pb-10">
				<h2>Membros</h2>
				<p className="mb-8">Membros que estão participando do grupo</p>
				<Table
					isStriped={true}
					shadow={"none"}
					className="default-border rounded-large grow"
				>
					<TableHeader>
						<TableColumn key={"nome"}>
							<p>Nome</p>
						</TableColumn>
						<TableColumn key={"cargo"}>
							<p>Cargo</p>
						</TableColumn>
						<TableColumn key={"entrou-em"}>
							<p>Entrou em</p>
						</TableColumn>
						<TableColumn align="end" key={"acoes"}>
							<p>Ações</p>
						</TableColumn>
					</TableHeader>
					<TableBody>
						{members.map((member) => (
							<TableRow key={member.user.id}>
								<TableCell>
									<div className="flex flex-row gap-x-4 items-center">
										<UserAvatar
											avatarURL={member.user.image}
										/>
										<p>{member.user.username}</p>
									</div>
								</TableCell>
								<TableCell>
									<Chip
										color={
											member.role === "moderator"
												? "success"
												: "default"
										}
									>
										{member.role}
									</Chip>
								</TableCell>
								<TableCell>
									{new Date(member.joinedAt).toLocaleString()}
								</TableCell>
								<TableCell>
									<div className="flex flex-row gap-x-4">
										{member.role === "member" ? (
											<Button
												isIconOnly={true}
												aria-label="a"
												onClick={() =>
													handlePromoteUser({
														username:
															member.user
																.username || "",
														id: member.user.id,
													})
												}
											>
												<ArrowUpIcon className="h-5" />
											</Button>
										) : (
											<Button
												isIconOnly={true}
												aria-label="a"
												isDisabled={
													member.role === "owner"
												}
												onClick={() =>
													handleUnpromoteUser({
														username:
															member.user
																.username || "",
														id: member.user.id,
													})
												}
											>
												<ArrowDownIcon className="h-5" />
											</Button>
										)}
										<Button
											isIconOnly={true}
											isDisabled={member.role === "owner"}
											color="danger"
											aria-label="b"
											onClick={() =>
												handleRemoveUser({
													username:
														member.user.username ||
														"",
													id: member.user.id,
												})
											}
										>
											<XMarkIcon className="h-6" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
