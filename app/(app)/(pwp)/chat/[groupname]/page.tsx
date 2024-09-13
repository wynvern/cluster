import fetchGroup from "@/lib/db/group/groupManagement";
import ChatPage from "./ChatPage";
import { fetchMessages } from "@/lib/db/group/groupChat";

export default async function ({ params }: { params: { groupname: string } }) {
	const group = await fetchGroup({ groupname: params.groupname });

	if (!group) {
		return <p>Grupo não encontrado</p>;
	}

	let latestMessges = await fetchMessages(group.id, 0);
	console.log(latestMessges, "latest", group.id);

	if (typeof latestMessges === "string") latestMessges = [];

	return <ChatPage group={group} latestMessages={latestMessges} />;
}
