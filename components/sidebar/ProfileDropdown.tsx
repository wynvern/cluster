"use client";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
	Image,
} from "@nextui-org/react";

export default function ProfileDropdown() {
	return (
		<Dropdown className="dark default-border shadow-none">
			<DropdownTrigger>
				<Link>
					<Image src="/brand/default-avatar.svg" />
				</Link>
			</DropdownTrigger>
			<DropdownMenu aria-label="Static Actions">
				<DropdownItem key="new">New file</DropdownItem>
				<DropdownItem key="copy">Copy link</DropdownItem>
				<DropdownItem key="edit">Edit file</DropdownItem>
				<DropdownItem
					key="delete"
					className="text-danger"
					color="danger"
				>
					Delete file
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
