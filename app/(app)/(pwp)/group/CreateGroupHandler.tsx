"use client";

import CreateGroup from "@/components/modal/CreateGroup";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function CreateGroupHandler() {
	const [createGroupActive, setCreateGroupActive] = useState(false);

	return (
		<>
			<Button onClick={() => setCreateGroupActive(true)} color="primary">
				Criar
			</Button>
			<CreateGroup
				active={createGroupActive}
				setActive={setCreateGroupActive}
			/>
		</>
	);
}
