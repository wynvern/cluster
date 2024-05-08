import AuthModalWrapper from "@/components/auth/AuthModalWrapper";
import PasswordInput from "@/components/auth/PasswordInput";
import ErrorBox from "@/components/general/ErrorBox";
import LogoTitle from "@/components/sign/LogoTitle";
import { updatePassword } from "@/lib/db/reset-password/resetPassword";
import {
	CheckIcon,
	KeyIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function NewPassword() {
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const params = useSearchParams();
	const [inputErrors, setInputErrors] = useState({
		password: "",
		repeatPassword: "",
		general: "",
	});

	function verifyInputs(password: string, repeatPassword: string) {
		const errors = {
			password: "",
			repeatPassword: "",
			general: "",
		};

		if (password === "") {
			errors.password = "Este campo é obrigatório.";
		} else if (password.length < 8) {
			errors.password = "A senha deve ter no mínimo 8 caracteres.";
		}

		if (repeatPassword === "") {
			errors.repeatPassword = "Este campo é obrigatório.";
		}

		if (password !== repeatPassword) {
			errors.repeatPassword = "As senhas não coincidem.";
		}

		setInputErrors(errors);
		return Object.values(errors).every((error) => error === "");
	}

	async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password") as string;
		const repeatPassword = formData.get("repeatPassword") as string;

		if (!verifyInputs(password, repeatPassword)) {
			setLoading(false);
			return false;
		}

		// Update password here
		const data = await updatePassword(password, params.get("code") || "");

		switch (data) {
			case "code-expired":
				setInputErrors({
					...inputErrors,
					general: "Código expirado. Solicite um novo link.",
				});
				break;
			case "invalid-code":
				setInputErrors({
					...inputErrors,
					general: "Código inválido. Solicite um novo link.",
				});
				break;
			case "password-updated":
				setSuccess(true);
				break;
		}

		setLoading(false);
	}

	return (
		<AuthModalWrapper
			title="Atualizar Senha"
			subtitle="Escolha uma nova senha e guarde-a."
		>
			<form
				className="gap-y-6 flex flex-col"
				onSubmit={handleUpdatePassword}
			>
				<PasswordInput
					name="password"
					variant="bordered"
					placeholder="Nova senha"
					startContent={<KeyIcon className="h-6" />}
					errorMessage={inputErrors.password}
					isInvalid={Boolean(inputErrors.password)}
					classNames={{ inputWrapper: "h-14" }}
					onChange={() =>
						setInputErrors({ ...inputErrors, password: "" })
					}
				/>
				<PasswordInput
					name="repeatPassword"
					variant="bordered"
					placeholder="Repita a senha"
					startContent={<KeyIcon className="h-6" />}
					errorMessage={inputErrors.repeatPassword}
					isInvalid={Boolean(inputErrors.repeatPassword)}
					classNames={{ inputWrapper: "h-14" }}
					onChange={() =>
						setInputErrors({
							...inputErrors,
							repeatPassword: "",
						})
					}
				/>
				<ErrorBox
					error={inputErrors.general}
					isVisible={Boolean(inputErrors.general)}
				/>
				<div className="flex items-center justify-between">
					<div>
						<Link href="/sigin">Voltar</Link>
					</div>
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
		</AuthModalWrapper>
	);
}
