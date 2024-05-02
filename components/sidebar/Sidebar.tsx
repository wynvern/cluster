import {
	ChatBubbleBottomCenterIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";

export default function Sidebar() {
	return (
		<>
			<div className="fixed h-dvh items-center sidebar-border flex-col justify-between py-6 w-20 hidden sm:flex">
				<Image
					alt="logo"
					className="h-8 w-8"
					src="/brand/logo.svg"
					height={50}
					width={50}
					priority={true}
				/>
				<div className="flex flex-col gap-y-8">
					<Link href="/">
						<HomeIcon className="h-8" />
					</Link>
					<Link href="/search">
						<MagnifyingGlassIcon className="h-8" />
					</Link>
					<Link href="/chat">
						<ChatBubbleBottomCenterIcon className="h-8" />
					</Link>
					<Link href="/group">
						<UserGroupIcon className="h-8" />
					</Link>
				</div>
				<div>
					<ProfileDropdown />
				</div>
			</div>

			<div
				style={{ zIndex: "999999" }}
				className="default-background fixed bottom-0 w-full sm:hidden flex items-center justify-around py-4 px-6 h-18 sidebar-border-mobile"
			>
				<Link href="/">
					<HomeIcon className="h-8" />
				</Link>
				<Link href="/search">
					<MagnifyingGlassIcon className="h-8" />
				</Link>
				<Link href="/chat">
					<ChatBubbleBottomCenterIcon className="h-8" />
				</Link>
				<Link href="/group">
					<UserGroupIcon className="h-8" />
				</Link>
			</div>
		</>
	);
}
