"use client";

import { useState } from "react";
import SendCode from "./SendCode";
import VerifyEmail from "./VerifyEmail";

export default function VerificationEmail() {
	const [activePage, setActivePage] = useState("send-code");

	return (
		<>
			{activePage === "send-code" ? (
				<SendCode onCodeSent={() => setActivePage("verify-email")} />
			) : (
				<VerifyEmail onReturn={() => setActivePage("send-code")} />
			)}
		</>
	);
}
