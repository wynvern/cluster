import { fetchUserChats } from "@/lib/db/group/groupChat";
import ChatWrapper from "./ChatWrapper";

export default async function LayoutChat({
	children,
}: {
	children: React.ReactNode;
}) {
	const groupChats = await fetchUserChats();

	if (typeof groupChats !== "string")
		return <ChatWrapper userGroups={groupChats}>{children}</ChatWrapper>;
}
