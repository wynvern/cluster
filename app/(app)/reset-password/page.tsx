"use client";

import { useSearchParams } from "next/navigation";
import SendResetLink from "./SendResetLink";
import NewPassword from "./NewPassword";

export default function ResetPassword() {
	const params = useSearchParams();

	if (params.get("code") !== null) {
		return (
			<>
				<NewPassword />
			</>
		);
	}

	return (
		<>
			<SendResetLink />
		</>
	);
}
