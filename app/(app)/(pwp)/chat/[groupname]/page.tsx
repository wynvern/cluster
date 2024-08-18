import fetchGroup from "@/lib/db/group/groupManagement";
import ChatPage from "./ChatPage";

export default async function ({ params }: { params: { groupname: string } }) {
	const group = await fetchGroup({ groupname: params.groupname });

	if (!group) {
		return <p>Grupo não encontrado</p>;
	}

	return <ChatPage group={group} />;
}
