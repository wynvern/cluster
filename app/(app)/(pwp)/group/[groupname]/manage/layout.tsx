"use client";

import InfoMessage from "@/components/card/InfoMessage";
import PageHeader from "@/components/general/PageHeader";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	CubeIcon,
	NoSymbolIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

export default function ManageGroup({
	params,
	children,
}: {
	params: { groupname: string };
	children: ReactNode;
}) {
	const path = usePathname();
	const isSmallScreen = useMediaQuery({ query: "(max-width: 1000px)" }); // adjust the value as per your requirement
	const router = useRouter();

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1200px] h-full relative flex">
				<div
					className={`sidebar-border w-1/3 ${
						!path.endsWith("manage") && isSmallScreen
							? "hidden"
							: ""
					} ${
						path.endsWith("manage") && isSmallScreen ? "w-full" : ""
					}`}
				>
					<PageHeader
						title={`Gerenciar g/${params.groupname}`}
						showBackButton
						className="bottom-border"
						isFixed={false}
						enableHeightUsage={false}
					/>

					{/* This is the sidebar */}
					<Link
						className="px-4 sm:px-10 py-6 bottom-border flex items-center justify-between"
						href={`/group/${params.groupname}/manage/general`}
					>
						<div className="flex">
							<CubeIcon className="h-6" />
							<p className="ml-2">Geral</p>
						</div>
					</Link>
					<Link
						className="px-4 sm:px-10 py-6 bottom-border flex items-center justify-between"
						href={`/group/${params.groupname}/manage/members`}
					>
						<div className="flex">
							<UserIcon className="h-6" />
							<p className="ml-2">Membros</p>
						</div>
					</Link>
					<Link
						className="px-4 sm:px-10 py-6 bottom-border flex items-center justify-between"
						href={`/group/${params.groupname}/manage/banned`}
					>
						<div className="flex">
							<NoSymbolIcon className="h-6" />
							<p className="ml-2">Banidos</p>
						</div>
					</Link>
				</div>
				<b
					className={`w-2/3 ${
						path.endsWith("manage") && isSmallScreen ? "hidden" : ""
					}`}
				>
					{children === null ? (
						<div className="w-full h-full flex items-center justify-center">
							<InfoMessage message="Escolha uma categoria para ver suas opções." />
						</div>
					) : (
						children
					)}
				</b>
			</div>
		</div>
	);
}
