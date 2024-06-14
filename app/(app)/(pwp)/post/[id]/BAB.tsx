"use client";

import NoPosts from "@/components/card/NoPosts";
import PostCard from "@/components/card/PostCard";
import SkeletonPostCard from "@/components/card/SkeletonPostCard";
import UserAvatar from "@/components/user/UserAvatar";
import { fetchPostById } from "@/lib/db/post/post";
import type Post from "@/lib/db/post/type";
import {
	ChevronLeftIcon,
	PaperAirplaneIcon,
	PhotoIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Image, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostPage({ params }: { params: { postId: string } }) {
	const [post, setPost] = useState<Post | null>(null);
	const [imageSelected, setImageSelected] = useState(false);
	const session = useSession();
	const router = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function fetchPost() {
			const post = await fetchPostById(params.postId);
			setPost(post);
		}

		fetchPost();
	}, []);

	return (
		<div className="w-full h-full flex">
			<div className="h-full w-1/2 sidebar-border">
				<div className="p-10 bottom-border">
					<div className="mb-10">
						<Button
							variant="bordered"
							isIconOnly={true}
							onClick={() => router.back()}
						>
							<ChevronLeftIcon className="h-6" />
						</Button>
					</div>
					{post ? (
						<>
							<PostCard
								post={post}
								disableLink={true}
								disableImages={true}
							/>
							<div className="ml-16 flex gap-x-4 items-start">
								<UserAvatar
									avatarURL={session.data?.user.image}
								/>
								<Textarea
									placeholder="Escreva seu comentário..."
									variant="bordered"
								/>
								<Button isIconOnly={true} variant="bordered">
									<PhotoIcon className="h-6" />
								</Button>
								<Button isIconOnly={true} variant="bordered">
									<PaperAirplaneIcon className="h-6" />
								</Button>
							</div>
						</>
					) : (
						<SkeletonPostCard />
					)}
				</div>
				<div className="my-8">
					<NoPosts message="Sem comentários" />
				</div>
			</div>
			<div className="h-full w-1/2 flex items-center justify-center">
				<div>
					{post && post?.media?.length >= 1 ? (
						<Image
							src={post?.media[0]}
							removeWrapper={true}
							className="w-full h-auto rounded-none"
						/>
					) : (
						""
					)}
				</div>
			</div>
		</div>
	);
}
