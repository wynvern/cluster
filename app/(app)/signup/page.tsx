"use client";

import AuthModalWrapper from "@/components/auth/AuthModalWrapper";
import GoogleLoginButton from "@/components/auth/GLoginButton";
import PasswordInput from "@/components/auth/PasswordInput";
import { createUser } from "@/lib/db/user/user";
import {
	CheckIcon,
	EnvelopeIcon,
	KeyIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUp() {
	const [loading, setLoading] = useState(false);
	const [inputError, setInputError] = useState({
		email: "",
		password: "",
		repeatPassword: "",
	});
	const router = useRouter();
	const [success, setSucess] = useState(false);
	const session = useSession();

	function validateInputs(
		email: string,
		password: string,
		repeatPassword: string
	) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const errors = {
			email: "",
			password: "",
			repeatPassword: "",
		};

		// Check if email is empty
		if (!email) {
			errors.email = "O email não pode estar vazio.";
		}
		// Check if email is valid
		else if (!emailRegex.test(email)) {
			errors.email = "Email inválido.";
		}

		if (!repeatPassword) {
			errors.repeatPassword = "A senha não pode estar vazia.";
		}

		if (repeatPassword !== password) {
			errors.repeatPassword = "As senhas não coincidem.";
		}

		// Check if password is empty
		if (!password) {
			errors.password = "A senha não pode estar vazia.";
		}
		// Check if password length is less than 8
		else if (password.length < 8) {
			errors.password = "A senha deve ter no mínimo 8 caracteres.";
		}

		// Update the state with the errors
		setInputError(errors);

		// Check if there are any errors
		const isValid = !Object.values(errors).some((error) => error !== "");

		return isValid;
	}

	async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password") as string;
		const email = formData.get("email") as string;
		const repeatPassword = formData.get("repeat-password") as string;
		const numberval = formData.get("numberval") as string;

		if (!validateInputs(email, password, repeatPassword)) {
			setLoading(false);
			return false;
		}

		const data = await createUser(email, password, numberval);

		if (data === "error") {
			setInputError({ ...inputError, email: "Erro ao criar conta." });
			setLoading(false);
			return false;
		}
		if (data === "ok") {
			setSucess(true);
			await signIn("credentials", {
				email,
				password,
				redirect: false,
			});
		}
		setLoading(false);
	}

	useEffect(() => {
		if (session.data?.user.id) {
			router.push("/");
		}
	}, [session]);

	return (
		<AuthModalWrapper title="Criar conta">
			<form className="gap-y-6 flex flex-col" onSubmit={handleSignUp}>
				<Input
					placeholder="Email"
					type="text"
					name="email"
					isInvalid={Boolean(inputError.email)}
					errorMessage={inputError.email}
					startContent={
						<EnvelopeIcon className="h-6 text-neutral-500" />
					}
					onValueChange={() => {
						setInputError({ ...inputError, email: "" });
					}}
					variant="bordered"
				/>
				<PasswordInput
					placeholder="Senha"
					name="password"
					isInvalid={Boolean(inputError.password)}
					errorMessage={inputError.password}
					startContent={<KeyIcon className="h-6 text-neutral-500" />}
					variant="bordered"
					onValueChange={() => {
						setInputError({ ...inputError, password: "" });
					}}
				/>
				<PasswordInput
					placeholder="Senha novamente"
					name="repeat-password"
					variant="bordered"
					startContent={<KeyIcon className="h-6 text-neutral-500" />}
					isInvalid={Boolean(inputError.repeatPassword)}
					errorMessage={inputError.repeatPassword}
					onValueChange={() => {
						setInputError({
							...inputError,
							repeatPassword: "",
						});
					}}
				/>
				<Input
					name="numberval"
					type="text"
					placeholder="Número de Telefone"
					className="absolute left-0 -top-40"
				/>

				<div className="flex justify-between items-center">
					<div>
						<p className="text-center">
							<Link href="/signin">Fazer Login</Link>
						</p>
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
								<PencilSquareIcon className="h-6" />
							)
						}
					>
						Criar Conta
					</Button>
				</div>
			</form>
			<div className="flex flex-col gap-y-6 items-center">
				<p className="text-center">Ou</p>
				<GoogleLoginButton />
			</div>
		</AuthModalWrapper>
	);
}
