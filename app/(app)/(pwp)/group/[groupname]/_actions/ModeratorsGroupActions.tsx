import {
	Dropdown,
	DropdownTrigger,
	DropdownItem,
	Button,
	DropdownMenu,
} from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface ModeratorGroupActionsProps {
	setCustomizeGroupActive: (active: boolean) => void;
	router: any;
	group: any;
}

export default function ModeratorGroupActions({
	setCustomizeGroupActive,
	router,
	group,
}: ModeratorGroupActionsProps) {
	return (
		// @ts-ignore
		<Dropdown backdrop="blur" className="default-border shadow-none">
			<DropdownTrigger>
				<Button isIconOnly={true} variant="bordered" size="sm">
					<EllipsisHorizontalIcon className="h-8" />
				</Button>
			</DropdownTrigger>
			{/* @ts-ignore */}
			<DropdownMenu>
				<DropdownItem
					description="Customize o grupo"
					startContent={<PencilIcon className="h-8" aria-label="Sign Out" />}
					aria-label="customize group"
					onClick={() => setCustomizeGroupActive(true)}
				>
					Customizar Perfil
				</DropdownItem>
				<DropdownItem
					description="Gerenciar o grupo"
					startContent={
						<Cog6ToothIcon className="h-8" aria-label="gerenciar-grupo" />
					}
					aria-label="manage group"
					onClick={() => router.push(`/group/${group.groupname}/manage`)}
				>
					Gerenciar Grupo
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
