"use client";

import LogoTitle from "@/components/sign/LogoTitle";
import { sendResetRequest } from "@/lib/db/reset-password/resetPassword";
import {
	AtSymbolIcon,
	CheckIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link } from "@nextui-org/react";
import { useState } from "react";

export default function sendResetLink() {
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [inputError, setInputError] = useState("");

	async function handleSendRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;

		if (!email) {
			setInputError("Email é obrigatório.");
			setLoading(false);
			return false;
		}

		const data = await sendResetRequest(email);

		setLoading(false);
		switch (data) {
			case "different-oauth-provider":
				setInputError(
					"Este email foi registrado com um provedor diferente."
				);
				break;
			case "code-already-sent":
				setInputError("Código já enviado. Verifique seu email.");
				break;
			case "code-sent":
				setSuccess(true);
				break;
			case "user-not-found":
				setInputError("Usuário não encontrado.");
				break;
			default:
				setInputError("Erro desconhecido.");
				break;
		}
	}

	return (
		<div className="flex w-full h-dvh items-center justify-center">
			<div className="default-border m-4 flex flex-col gap-y-6 w-full max-w-[500px] px-8 py-8 sm:p-16  rounded-large">
				<LogoTitle />
				<div>
					<h2>Atualizar Senha</h2>
					<p>
						Digite seu email para receber um código de verificação.
					</p>
				</div>
				<form
					className="gap-y-6 flex flex-col"
					onSubmit={handleSendRequest}
				>
					<Input
						name="email"
						variant="bordered"
						placeholder="Email"
						startContent={<AtSymbolIcon className="h-6" />}
						errorMessage={inputError}
						isInvalid={Boolean(inputError)}
						classNames={{ inputWrapper: "h-14" }}
						onChange={() => setInputError("")}
					/>

					<div className="flex items-center justify-between">
						<Link href="/signin">Voltar</Link>
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
			</div>
		</div>
	);
}
