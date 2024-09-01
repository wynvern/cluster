import GroupCard from "@/components/group/GroupCard";
import { ScrollShadow } from "@nextui-org/react";
import CreateGroupHandler from "./CreateGroupHandler";
import InfoMessage from "@/components/card/InfoMessage";
import { fetchRecentGroups } from "@/lib/db/group/groupManagement";

export default async function GroupPage() {
	const recentGroups = await fetchRecentGroups();

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[100vw] sm:max-w-[1000px] h-full relative pt-4">
				<div className="px-4 sm:px-10 ">
					<h1>Grupos</h1>
					<h2>Conecte-se, Colabore e Cresça.</h2>
					<p>
						Descubra grupos que compartilham dos seus interesses e
						participe de discussões enriquecedoras.
					</p>
				</div>

				<div className="my-4 bottom-border w-full" />

				<div className="w-full px-4 sm:px-10 ">
					<h2 className="mb-4">Recentes</h2>
					{recentGroups.length > 0 ? (
						<ScrollShadow
							// @ts-ignore
							orientation="horizontal"
							className="gap-x-4 flex w-full"
						>
							{recentGroups?.map((group) => (
								<GroupCard key={group.id} group={group} />
							))}
						</ScrollShadow>
					) : (
						<div className="h-20 flex items-center justify-center">
							<InfoMessage message="Nenhum grupo recente." />
						</div>
					)}
				</div>

				<div className="my-4 bottom-border w-full" />

				<div className="w-full px-4 sm:px-10 ">
					<h2 className="mb-4">Crie o seu</h2>
					<div className="w-full gap-y-8 border-default rounded-large p-6 flex flex-col justify-between">
						<div>
							<h1>Crie o seu Grupo</h1>
							<h2>Construa sua Comunidade</h2>
							<p>
								Compartilhe ideias, colabore em projetos e
								cresça junto com pessoas que compartilham dos
								mesmos interesses.
							</p>
						</div>
						<CreateGroupHandler />
					</div>
				</div>
			</div>
		</div>
	);
}
