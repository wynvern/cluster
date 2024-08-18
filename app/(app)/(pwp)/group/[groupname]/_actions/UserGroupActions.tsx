import {
	Dropdown,
	DropdownTrigger,
	DropdownItem,
	Button,
	DropdownMenu,
} from "@nextui-org/react";
import { EllipsisHorizontalIcon, FlagIcon } from "@heroicons/react/24/outline";

interface UserGroupActionsProps {
	setReportGroup: (active: boolean) => void;
}

export default function UserGroupActions({
	setReportGroup,
}: UserGroupActionsProps) {
	return (
		<Dropdown className="default-border shadow-none">
			<DropdownTrigger>
				<Button isIconOnly={true} variant="bordered">
					<EllipsisHorizontalIcon className="h-8" />
				</Button>
			</DropdownTrigger>
			<DropdownMenu>
				<DropdownItem
					description="Reportar grupo"
					startContent={
						<FlagIcon className="h-8" aria-label="Sign Out" />
					}
					aria-label="report group"
					onClick={() => setReportGroup(true)}
					className="text-danger"
				>
					Reportar Grupo
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
