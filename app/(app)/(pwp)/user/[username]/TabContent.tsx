import NoPosts from "@/components/card/NoPosts";
import PostCard from "@/components/card/PostCard";
import SkeletonPostCard from "@/components/card/SkeletonPostCard";
import PostsList from "@/components/post/PostsList";
import type Post from "@/lib/db/post/type";
import { Tab, Tabs } from "@nextui-org/react";

export default function TabContent({
	posts,
	bookmarkPosts,
}: {
	posts: Post[] | null;
	bookmarkPosts: Post[] | null;
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
					Tab 1
				</Tab>
			</Tabs>
		</div>
	);
}
