import ReportGroup from "@/components/modal/ReportGroup";
import {
	ArrowUpRightIcon,
	BellIcon,
	EllipsisHorizontalIcon,
	FlagIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import { useState } from "react";

export default function GroupChatDropdown({ group }: { group: any }) {
	const [reportGroup, setReportGroup] = useState(false);

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Button isIconOnly={true} variant="bordered" s size="sm">
						<EllipsisHorizontalIcon className="h-6" />
					</Button>
				</DropdownTrigger>
				{/* @ts-ignore */}
				<DropdownMenu>
					<DropdownItem
						description="Ir para a página do grupo."
						startContent={
							<ArrowUpRightIcon
								className="h-6"
								aria-label="Sign Out"
							/>
						}
						aria-label="go to group"
						href={`/group/${group.groupname}`}
					>
						Ir para o grupo
					</DropdownItem>
					<DropdownItem
						description="Silenciar grupo"
						startContent={
							<BellIcon className="h-6" aria-label="Sign Out" />
						}
						aria-label="mute group"
					>
						Silenciar
					</DropdownItem>
					<DropdownItem
						description="Reportar grupo"
						startContent={
							<FlagIcon className="h-6" aria-label="Sign Out" />
						}
						aria-label="report group"
						onClick={() => setReportGroup(true)}
						className="text-danger"
					>
						Reportar Grupo
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<ReportGroup
				groupname={group.groupname}
				active={reportGroup}
				setActive={() => setReportGroup(false)}
			/>
		</>
	);
}
