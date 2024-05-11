"use client";

import FollowUnfollowGroup from "@/components/general/FollowUnfollowGroup";
import CreateGroup from "@/components/modal/CreateGroup";
import { fetchRecentGroups } from "@/lib/db/group/group";
import { Button, Chip, Image, ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Categories from "../../../../public/categories.json";

interface GroupRecent {
	id: string;
	name: string | null;
	groupname: string;
	image: string | null;
	banner: string | null;
}
[];

export default function Groups() {
	const [createGroupActive, setCreateGroupActive] = useState(false);
	const [recentGroups, setRecentGroups] = useState<GroupRecent[] | null>(
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
								<div
									key={group.id}
									className="rounded-large border-default w-full min-w-[400px] mb-4"
								>
									<div className="relative">
										<Image
											src={group.banner || ""}
											removeWrapper={true}
											className="w-full object-cover rounded-b-none"
											style={{ aspectRatio: "400 / 160" }}
										/>
										<Image
											removeWrapper={true}
											src={
												group.image ||
												"/brand/default-group.svg"
											}
											className="w-[100px] h-[100px] absolute top-[90px] left-4"
										/>
									</div>
									<div className="h-10 w-full px-4 py-4 flex justify-between">
										<div />
										<FollowUnfollowGroup
											groupname={group.groupname}
										/>
									</div>
									<div className="w-full h-20 px-4">
										<h2>{group.name}</h2>
										<p>g/{group.groupname}</p>
									</div>
								</div>
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
