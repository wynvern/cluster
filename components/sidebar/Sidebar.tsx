import {
	ChatBubbleBottomCenterIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import { headers } from "next/headers";
import NotificationsButton from "./NotificationsButton";
import { getNotifications } from "@/lib/db/user/user";

export default async function Sidebar() {
	const headersList = headers();
	const fullUrl = headersList.get("x-current-path") || "";
	const path = fullUrl;
	const previousNotifications = await getNotifications();

	return (
		<>
			<div
				className="fixed h-dvh border-for-sidebar flex-col sidebar-container bg-background hidden sm:flex"
				style={{ zIndex: 90000 }}
			>
				<div className="flex flex-col justify-between h-full sidebar-wrapper py-6">
					<div className="flex items-center gap-x-4 pl-[7px]">
						<Link href="/">
							<Image
								alt="logo"
								className="h-8 w-8 invert-image"
								src="/brand/logo.svg"
								height={50}
								width={50}
								priority={true}
								draggable={false}
							/>
						</Link>
						<div className="sidebar-inside">
							<h2 className="main-text">Cluster</h2>
						</div>
					</div>
					<div className="flex flex-col gap-y-8 pl-[9.5px]">
						<Link href="/" className="flex items-center gap-x-4">
							<div>
								<HomeIcon className="h-7" />
							</div>
							<div className="sidebar-inside">
								{path === "/" ? (
									<p>
										<b>Home</b>
									</p>
								) : (
									<p>Home</p>
								)}
							</div>
						</Link>
						<NotificationsButton
							previousNotifications={previousNotifications}
						/>{" "}
						<Link
							href="/search"
							className="flex items-center gap-x-4"
						>
							<div>
								<MagnifyingGlassIcon className="h-7" />
							</div>
							<div className="sidebar-inside">
								{path.startsWith("/search") ? (
									<p>
										<b>Pesquisa</b>
									</p>
								) : (
									<p>Pesquisa</p>
								)}
							</div>
						</Link>
						<Link
							href="/chat"
							className="flex items-center gap-x-4"
						>
							<div>
								<ChatBubbleBottomCenterIcon className="h-7" />
							</div>
							<div className="sidebar-inside">
								{path.startsWith("/chat") ? (
									<p>
										<b>Chat</b>
									</p>
								) : (
									<p>Chat</p>
								)}
							</div>
						</Link>
						<Link
							href="/group"
							className="flex items-center gap-x-4"
						>
							<div>
								<UserGroupIcon className="h-7" />
							</div>
							<div className="sidebar-inside">
								{path.startsWith("/group") ? (
									<p>
										<b>Grupos</b>
									</p>
								) : (
									<p>Grupos</p>
								)}
							</div>
						</Link>
					</div>
					<div>
						<ProfileDropdown />
					</div>
				</div>
			</div>

			<div
				style={{ zIndex: "999998" }}
				className="bg-background fixed bottom-0 w-full sm:hidden flex items-center justify-around py-4 px-6 h-14 sidebar-border-mobile"
			>
				<Link href="/">
					<HomeIcon className="h-7" />
				</Link>
				<Link href="/search">
					<MagnifyingGlassIcon className="h-7" />
				</Link>
				<NotificationsButton
					previousNotifications={previousNotifications}
				/>
				<Link href="/chat">
					<ChatBubbleBottomCenterIcon className="h-7" />
				</Link>
				<Link href="/group">
					<UserGroupIcon className="h-7" />
				</Link>
			</div>
		</>
	);
}
