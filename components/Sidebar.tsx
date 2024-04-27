import {
	ChatBubbleBottomCenterIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@nextui-org/react";
import Image from "next/image";

export default function Sidebar() {
	return (
		<div className="h-dvh items-center sidebar-border flex flex-col justify-between py-6 w-20">
			<Image
				alt="logo"
				className="h-8"
				src="/brand/logo.svg"
				height={50}
				width={50}
			/>
			<div className="flex flex-col gap-y-8">
				<Link>
					<HomeIcon className="h-8" />
				</Link>
				<Link>
					<MagnifyingGlassIcon className="h-8" />
				</Link>
				<Link>
					<ChatBubbleBottomCenterIcon className="h-8" />
				</Link>
				<Link>
					<UserGroupIcon className="h-8" />
				</Link>
			</div>
			<div>a</div>
		</div>
	);
}
