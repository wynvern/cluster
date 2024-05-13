"use client";

import FollowUnfollowGroup from "@/components/general/FollowUnfollowGroup";
import CreateGroup from "@/components/modal/CreateGroup";
import { fetchRecentGroups } from "@/lib/db/group/group";
import { Button, Chip, ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Categories from "../../../../public/categories.json";
import type { GroupCard as GroupCardType } from "@/lib/db/group/type";
import GroupCard from "@/components/group/GroupCard";

export default function Groups() {
	const [createGroupActive, setCreateGroupActive] = useState(false);
	const [recentGroups, setRecentGroups] = useState<GroupCardType[] | null>(
		null
	);

	async function handleFetchRecentGroups() {
		const data = await fetchRecentGroups();
		// temp
		if (data && data.length > 0) {
			const firstDataDuplicated = { ...data[0] };
			setRecentGroups([
				firstDataDuplicated,
				firstDataDuplicated,
				firstDataDuplicated,
				...data,
			]);
		}
	}

	// onload
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchRecentGroups();
	}, []);

	return (
		<>
			<div className="flex justify-center w-full h-full">
				<div className="side-borders w-full max-w-[1000px] h-full px-10 pt-10 flex flex-col gap-y-10">
					<div>
						<h1>Grupos</h1>
						<h2>Descrição</h2>
						<p>Mais texto</p>
					</div>

					<div className="w-full">
						<h2 className="mb-4">Recentes</h2>
						<ScrollShadow
							orientation="horizontal"
							className="overflow-x-scroll flex h-fit gap-x-4"
						>
							{recentGroups?.map((group) => (
								<GroupCard key={group.id} group={group} />
							))}
						</ScrollShadow>
					</div>

					<div>
						<h2 className="mb-4">Crie o seu</h2>
						<div className="w-full h-[400px] border-default rounded-large p-10 flex flex-col justify-between">
							<div>
								<h1>Crie o seu Grupo</h1>
								<h2>Blalbalb</h2>
								<p>aoiqwoighi</p>
							</div>

							<Button
								onClick={() => setCreateGroupActive(true)}
								variant="bordered"
							>
								Criar
							</Button>
						</div>
					</div>

					<div>
						<h2 className="mb-4">Categorias</h2>
						<ScrollShadow
							orientation="horizontal"
							className="flex overflow-x-scroll gap-x-2"
						>
							<Chip color="primary">Todas</Chip>
							{Categories.map((category) => (
								<Chip
									variant="bordered"
									key={category}
									className="mb-4"
								>
									{category}
								</Chip>
							))}
						</ScrollShadow>
					</div>
				</div>
			</div>

			<CreateGroup
				active={createGroupActive}
				setActive={setCreateGroupActive}
			/>
		</>
	);
}
