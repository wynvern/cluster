"use client";

import { useEffect, useState } from "react";
import CategoryHeader from "../CategoryHeader";
import { fetchGroupSettings, getMembers } from "@/lib/db/group/group";
import type { GroupMember } from "@prisma/client";
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function handleFetch() {
			const response = await getMembers({ groupname: params.groupname });
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
									<TableCell>actions</TableCell>
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
