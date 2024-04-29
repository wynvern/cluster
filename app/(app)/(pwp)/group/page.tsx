"use client";

import CreateGroup from "@/components/modal/CreateGroup";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function Groups() {
	const [createGroupActive, setCreateGroupActive] = useState(false);

	return (
		<>
			<Button onClick={() => setCreateGroupActive(true)}>Criar</Button>
			<CreateGroup
				active={createGroupActive}
				setActive={setCreateGroupActive}
			/>
		</>
	);
}
