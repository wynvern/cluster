import PostsList from "@/components/post/PostsList";
import type Post from "@/lib/db/post/type";
import { Tab, Tabs } from "@nextui-org/react";

export default function TabContent({ posts }: { posts: Post[] | null }) {
	return (
		<div className="w-full flex items-center flex-col mt-10">
			<Tabs
				classNames={{ tabList: "mb-2" }}
				className="w-full bottom-border flex items-center justify-center"
				variant="underlined"
			>
				<Tab title={<h3 className="p-2">Posts</h3>} className="px-0">
					<PostsList posts={posts} />
				</Tab>
				<Tab title={<h3 className="p-2">Membros</h3>}>Tab 1</Tab>
			</Tabs>
		</div>
	);
}
