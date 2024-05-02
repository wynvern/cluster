"use client";

import CustomizeGroup from "@/components/modal/CustomizeGroup";
import type Group from "@/lib/db/group/type";
import {
	Cog6ToothIcon,
	EllipsisHorizontalIcon,
	FlagIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@nextui-org/react";
import { useState } from "react";

export default function GroupDropdown({
	defaultGroup,
}: {
	defaultGroup: Group;
}) {
	const [customizeGroupActive, setCustomizeGroupActive] = useState(false);

	return (
		<>
			<Dropdown
				className="default-border shadow-none"
				placement="bottom-end"
			>
				<DropdownTrigger>
					<Button isIconOnly={true} variant="bordered">
						<EllipsisHorizontalIcon className="h-8" />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="Static Actions">
					<DropdownItem
						description="Customize este grupo."
						startContent={
							<PencilIcon className="h-8" aria-label="Sign Out" />
						}
						aria-label="customize group"
						onClick={() => setCustomizeGroupActive(true)}
					>
						Customizar Grupo
					</DropdownItem>
					<DropdownItem
						description="Geerencie este grupo."
						startContent={
							<Cog6ToothIcon
								className="h-8"
								aria-label="Sign Out"
							/>
						}
						aria-label="configure group"
						href={`${defaultGroup.groupname}/manage`}
					>
						Gerenciar
					</DropdownItem>
					<DropdownItem
						description="Reporte este grupo."
						className="text-danger"
						startContent={
							<FlagIcon className="h-8" aria-label="Sign Out" />
						}
						aria-label="report-group"
						onClick={() => setCustomizeGroupActive(true)}
					>
						Reportar Grupo
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<CustomizeGroup
				active={customizeGroupActive}
				setActive={setCustomizeGroupActive}
				defaultGroup={defaultGroup}
			/>
		</>
	);
}
