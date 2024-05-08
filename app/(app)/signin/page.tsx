"use client";

import GoogleLoginButton from "@/components/sign/GLoginButton";
import {
	ArrowLeftEndOnRectangleIcon,
	EnvelopeIcon,
	KeyIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link } from "@nextui-org/react";
import { type SignInResponse, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoTitle from "@/components/sign/LogoTitle";
import AuthModalWrapper from "@/components/auth/AuthModalWrapper";
import PasswordInput from "@/components/auth/PasswordInput";

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [inputEmailVal, setInputEmailVal] = useState({
		message: "",
		active: false,
	});
	const router = useRouter();
	const [inputPasswordVal, setInputPasswordVal] = useState({
		message: "",
		active: false,
	});

	function validateForm(email: string, password: string, numberval: string) {
		const errors = {
			email: "",
			password: "",
		};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (numberval) {
			return false;
		}

		if (email === "") {
			errors.email = "Email não pode estar vazio.";
		} else if (!emailRegex.test(email)) {
			errors.email = "Email digitado é inválido.";
		}

		if (password === "") {
			errors.password = "Senha não pode estar vazia.";
		}

		setInputEmailVal({
			message: errors.email,
			active: errors.email !== "",
		});

		setInputPasswordVal({
			message: errors.password,
			active: errors.password !== "",
		});

		return errors.email !== "" || errors.password !== "";
	}

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.currentTarget);

		const formEmail: string = formData.get("email") as string;
		const formPassword: string = formData.get("password") as string;

		if (
			validateForm(
				formEmail,
				formPassword,
				formData.get("numberval") as string
			)
		) {
			setLoading(false);
			return;
		}

		const signInResult: SignInResponse | undefined = await signIn(
			"credentials",
			{
				email: formEmail,
				password: formPassword,
				redirect: false,
			}
		);

		if (!signInResult) {
			return false;
		}

		if (signInResult.error === "password-not-match") {
			setInputPasswordVal({
				message: "Senha incorreta.",
				active: true,
			});
		}

		if (signInResult.error === "email-not-found") {
			setInputEmailVal({
				message: "Email não encontrado.",
				active: true,
			});
		}

		setLoading(false);
		router.push("/");
	}

	return (
		<AuthModalWrapper title="Entrar">
			<form className="gap-y-6 flex flex-col" onSubmit={handleLogin}>
				<Input
					placeholder="Email"
					type="text"
					name="email"
					color="default"
					variant="bordered"
					classNames={{ inputWrapper: "h-14" }}
					startContent={
						<EnvelopeIcon className="h-6 text-neutral-500" />
					}
					isInvalid={inputEmailVal.active}
					errorMessage={inputEmailVal.message}
					onValueChange={() => {
						setInputEmailVal({
							message: "",
							active: false,
						});
					}}
				/>
				<PasswordInput
					placeholder="Senha"
					color="default"
					variant="bordered"
					name="password"
					classNames={{ inputWrapper: "h-14" }}
					startContent={<KeyIcon className="h-6 text-neutral-500" />}
					isInvalid={inputPasswordVal.active}
					errorMessage={inputPasswordVal.message}
					onValueChange={() => {
						setInputPasswordVal({
							message: "",
							active: false,
						});
					}}
				/>
				<Input
					name="numberval"
					type="text"
					placeholder="Número de Telefone"
					className="absolute left-0 -top-40"
				/>
				<div>
					<p className="text-center">
						<Link href="/reset-password">Esqueceu sua senha?</Link>
					</p>
				</div>

				<div className="flex justify-between items-center">
					<div>
						<p className="text-center">
							<Link href="/signup">Crie uma conta</Link>
						</p>
					</div>

					<Button
						type="submit"
						color="primary"
						isDisabled={loading}
						isLoading={loading}
						startContent={
							loading ? (
								""
							) : (
								<ArrowLeftEndOnRectangleIcon className="h-6" />
							)
						}
					>
						Entrar
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
