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
						<TableBody items={members}>
							{(item: Member) => (
								<TableRow key={item.user.id}>
									{(columnKey) => (
										<>
											<TableCell>
												{item.user.username}
											</TableCell>
											<TableCell>{item.role}</TableCell>
											<TableCell>
												{prettyDate(item.joinedAt)}
											</TableCell>
											<TableCell>abc</TableCell>
										</>
									)}
								</TableRow>
							)}
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
