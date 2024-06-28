import fetchGroup from "@/lib/db/group/groupManagement";
import ChatPage from "./ChatPage";
import { decryptToken, generateSecretToken } from "@/lib/socket";

export default async function ({ params }: { params: { groupname: string}}) {
    const group = await fetchGroup({ groupname: params.groupname })
    const token = await generateSecretToken();

    if (!group || !token) {
        return (<p>Grupo não encontrado</p>)
    }

    return <ChatPage group={group} token={token}/>
}