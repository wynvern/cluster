import GroupList from "@/components/group/GroupList";
import PostsList from "@/components/post/PostsList";
import type { GroupCard } from "@/lib/db/group/type";
import type Post from "@/lib/db/post/type";
import { Tab, Tabs } from "@nextui-org/react";

export default function TabContent({
	posts,
	bookmarkPosts,
	groups,
}: {
	posts: Post[] | null;
	bookmarkPosts: Post[] | null;
	groups: GroupCard[] | null;
}) {
	return (
		<div className="w-full flex items-center flex-col mt-10">
			<Tabs
				classNames={{ tabList: "mb-2", tabContent: "w-full" }}
				className="w-full bottom-border flex items-center justify-center"
				variant="underlined"
			>
				<Tab
					title={<h3 className="p-2">Posts</h3>}
					className="px-0 w-full"
				>
					<PostsList posts={posts} />
				</Tab>
				<Tab
					title={<h3 className="p-2">Salvos</h3>}
					className="px-0 w-full"
				>
					<PostsList posts={bookmarkPosts} />
				</Tab>
				<Tab
					title={<h3 className="p-2">Grupos</h3>}
					className="px-0 w-full"
				>
					<GroupList groups={groups} />
				</Tab>
			</Tabs>
		</div>
	);
}
