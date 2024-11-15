"use client";

import PostCard from "@/components/card/PostCard";
import PageHeader from "@/components/general/PageHeader";
import type RecursiveComments from "@/lib/db/post/comment/type";
import type Post from "@/lib/db/post/type";
import ChatSection from "./ChatSection";
import ImageViewer from "./ImageViewer";
import { useMediaQuery } from "react-responsive";
import { useUserRoleStore } from "@/hooks/role";
import { useEffect } from "react";

export default function PostWrapper({
	post,
	comments,
	userRole,
}: {
	post: Post;
	comments: RecursiveComments[];
	userRole: string | null;
}) {
	const isSmallScreen = useMediaQuery({ maxWidth: 1000 });
	const setUserRole = useUserRoleStore((state) => state.setUserRole);

	useEffect(() => {
		if (userRole) {
			setUserRole(post.group.groupname, userRole);
		}
	}, []);

	return (
		<div
			className={`w-full h-full flex  ${
				post.media.length < 1 && "justify-center"
			}`}
		>
			<div
				className={`h-full min-h-dvh ${
					post.media.length < 1 || isSmallScreen
						? "w-full max-w-[1000px] side-borders"
						: "w-1/2 sidebar-border"
				}`}
			>
				<div className="w-full">
					<PageHeader title="Post" showBackButton={true} />
					<div className="bottom-border w-full mb-6" />
					<PostCard
						disableComments={true}
						post={post}
						disableLink={true}
						isUserPage={false}
						disableImages={!isSmallScreen}
					/>
					<div
						className={`bottom-border w-full mt-4 ${
							isSmallScreen ? "mt-4" : ""
						}`}
					/>
					<ChatSection post={post} comments={comments} />
				</div>
			</div>
			{!isSmallScreen && post.media && post.media.length > 0 && (
				<div className="h-dvh w-1/2 flex items-center justify-center px-4">
					<ImageViewer media={post?.media} />
				</div>
			)}
		</div>
	);
}
