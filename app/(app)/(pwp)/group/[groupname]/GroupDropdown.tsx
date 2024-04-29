"use client";

import CustomizeGroup from "@/components/modal/CustomizeGroup";
import type Group from "@/lib/db/group/type";
import {
	EllipsisHorizontalIcon,
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
						description="Customize o seu grupo"
						startContent={
							<PencilIcon className="h-8" aria-label="Sign Out" />
						}
						aria-label="customize profile"
						onClick={() => setCustomizeGroupActive(true)}
					>
						Customizar Grupo
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
