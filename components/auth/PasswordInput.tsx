"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

export default function PasswordInput({ ...props }) {
	const [toggle, setToggle] = useState(true);

	return (
		<Input
			type={toggle ? "password" : "text"}
			{...props}
			endContent={
				<Button
					isIconOnly={true}
					variant="bordered"
					className="border-none"
					onClick={() => setToggle(!toggle)}
				>
					{toggle ? (
						<EyeIcon className="h-6" />
					) : (
						<EyeSlashIcon className="h-6" />
					)}
				</Button>
			}
		/>
	);
}
