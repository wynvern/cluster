"use client";

import LogoTitle from "@/components/sign/LogoTitle";
import { sendCode } from "@/lib/db/verifyEmail/verifyEmail";
import { CheckIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";
import { useState } from "react";

export default function SendCode({ onCodeSent }: { onCodeSent: () => void }) {
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [inputError, setInputError] = useState("");

	function setCodeSent() {}

	async function handleSendRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = await sendCode();
		setLoading(true);

		setLoading(false);
		switch (data) {
			case "code-sent":
				setSuccess(true);
				setTimeout(() => {
					onCodeSent();
				}, 3000);
				break;
			case "no-session":
				setInputError("No session");
				break;
			case "request-already-pending":
				onCodeSent();
				break;
		}
	}

	return (
		<div className="flex w-full h-dvh items-center justify-center">
			<div className="default-border m-4 flex flex-col gap-y-6 w-full max-w-[500px] px-8 py-8 sm:p-16  rounded-large">
				<LogoTitle />
				<div>
					<h2>Verificar Email</h2>
					<p>Clique no botão para receber um código por email.</p>
				</div>
				<form
					className="gap-y-6 flex flex-col"
					onSubmit={handleSendRequest}
				>
					<div className="flex items-center justify-between">
						<p>
							<Link onClick={() => onCodeSent()}>
								Possuí um código?
							</Link>
						</p>
						<Button
							type="submit"
							color={success ? "success" : "primary"}
							isLoading={loading}
							isDisabled={loading || success}
							startContent={
								loading ? (
									""
								) : success ? (
									<CheckIcon className="h-6" />
								) : (
									<PaperAirplaneIcon className="h-6" />
								)
							}
						>
							{success ? "Enviado" : "Enviar"}
						</Button>
					</div>
					{inputError ? (
						<p className="text-danger w-full text-center">
							{inputError}
						</p>
					) : (
						""
					)}
				</form>
			</div>
		</div>
	);
}
