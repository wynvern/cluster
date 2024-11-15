import fetchGroup, { fetchGroupSettings } from "@/lib/db/group/groupManagement";
import ChatPage from "./ChatPage";
import { fetchMessages } from "@/lib/db/group/groupChat";
import { memberHasPermission } from "@/lib/db/group/groupUtils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ({ params }: { params: { groupname: string } }) {
	const group = await fetchGroup({ groupname: params.groupname });

	if (!group) {
		return <p>Grupo não encontrado</p>;
	}

	const groupSettings = await fetchGroupSettings({
		groupname: params.groupname,
	});

	const userSession = await getServerSession(authOptions);
	const isModerator = await memberHasPermission(
		userSession?.user.id || "",
		group.groupname,
		"moderator",
	);

	let latestMessges = await fetchMessages(group.id, 0);
	if (typeof latestMessges === "string") latestMessges = [];

	const isChatDisabled = !isModerator && !groupSettings?.chatEnabled;

	return (
		<ChatPage
			group={group}
			latestMessages={latestMessges}
			isChatDisabledDefault={isChatDisabled}
		/>
	);
}
