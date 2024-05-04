import NoPosts from "@/components/card/NoPosts";
import PostCard from "@/components/card/PostCard";
import SkeletonPostCard from "@/components/card/SkeletonPostCard";
import type Post from "@/lib/db/post/type";
import { Tab, Tabs } from "@nextui-org/react";
import { useEffect } from "react";

export default function TabContent({ posts }: { posts: Post[] }) {
	return (
		<div className="w-full flex items-center flex-col mt-10">
			<Tabs
				classNames={{ tabList: "mb-2" }}
				className="w-full bottom-border flex items-center justify-center"
				variant="underlined"
			>
				<Tab title={<h3 className="p-2">Posts</h3>} className="px-0">
					<div
						className={`px-4 sm:px-10 mt-10 ${
							posts.length >= 1 ? "hidden" : ""
						}`}
					>
						<NoPosts message="Nenhum post encontrado" />
					</div>
					<div className="mt-6 flex flex-col gap-y-10">
						{posts.map((post) => (
							<div
								key={post.id}
								className="bottom-border px-4 sm:px-10"
							>
								<PostCard post={post} />
							</div>
						))}
					</div>
				</Tab>
				<Tab title={<h3 className="p-2">Membros</h3>}>Tab 1</Tab>
			</Tabs>
		</div>
	);
}
