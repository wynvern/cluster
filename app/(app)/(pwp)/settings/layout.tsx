"use client";

import NoPosts from "@/components/card/NoPosts";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	CubeIcon,
	NoSymbolIcon,
	PencilIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

export default function ManageSettings({ children }: { children: ReactNode }) {
	const path = usePathname();
	const isSmallScreen = useMediaQuery({ query: "(max-width: 1000px)" }); // adjust the value as per your requirement
	const router = useRouter();

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1200px] h-full relative flex">
				<div
					className={`sidebar-border w-1/3 pt-6 ${
						!path.endsWith("manage") && isSmallScreen
							? "hidden"
							: ""
					} ${
						path.endsWith("manage") && isSmallScreen ? "w-full" : ""
					}`}
				>
					<div className="flex items-center gap-x-4 px-4 sm:px-10 bottom-border pb-10">
						<Button
							isIconOnly={true}
							variant="bordered"
							onClick={() => router.back()}
						>
							<ChevronLeftIcon className="h-6" />
						</Button>
						<h2>Configurações</h2>
					</div>

					{/* This is the sidebar */}
					<Link
						className="bottom-border px-4 sm:px-10 py-4 flex items-center justify-between"
						href={"/settings/general"}
					>
						<div className="flex">
							<CubeIcon className="h-6" />
							<p className="ml-2">Geral</p>
						</div>
						<div>
							<Button isIconOnly={true} color="secondary">
								<ChevronRightIcon className="h-6" />
							</Button>
						</div>
					</Link>
					<Link
						className="bottom-border px-4 sm:px-10 py-4 flex items-center justify-between"
						href={"/settings/appearance"}
					>
						<div className="flex">
							<PencilIcon className="h-6" />
							<p className="ml-2">Aparência</p>
						</div>
						<div>
							<Button isIconOnly={true} color="secondary">
								<ChevronRightIcon className="h-6" />
							</Button>
						</div>
					</Link>
					<Link
						className="bottom-border px-4 sm:px-10 py-4 flex items-center justify-between"
						href={"/settings/blocked"}
					>
						<div className="flex">
							<NoSymbolIcon className="h-6" />
							<p className="ml-2">Bloqueados</p>
						</div>
						<div>
							<Button isIconOnly={true} color="secondary">
								<ChevronRightIcon className="h-6" />
							</Button>
						</div>
					</Link>
				</div>
				<b
					className={`w-2/3 pt-6 ${
						path.endsWith("manage") && isSmallScreen ? "hidden" : ""
					}`}
				>
					{children === null ? (
						<div className="w-full h-full flex items-center justify-center">
							<NoPosts message="Escolha uma categoria para ver suas opções." />
						</div>
					) : (
						children
					)}
				</b>
			</div>
		</div>
	);
}
