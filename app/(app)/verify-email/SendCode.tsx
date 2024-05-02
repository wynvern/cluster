"use client";

import AuthModalWrapper from "@/components/auth/AuthModalWrapper";
import ErrorBox from "@/components/general/ErrorBox";
import LogoTitle from "@/components/sign/LogoTitle";
import { sendCode } from "@/lib/db/verifyEmail/verifyEmail";
import { CheckIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";
import { signOut } from "next-auth/react";
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
		<AuthModalWrapper
			title="Enviar código"
			subtitle="Clique no botão para receber um código por email."
		>
			<form
				className="gap-y-6 flex flex-col"
				onSubmit={handleSendRequest}
			>
				<ErrorBox error={inputError} isVisible={Boolean(inputError)} />
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
			</form>
			<div className="w-full flex items-center">
				<Link onClick={() => signOut()} className="w-full">
					Sair
				</Link>
			</div>
		</AuthModalWrapper>
	);
}
