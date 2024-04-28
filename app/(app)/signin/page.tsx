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

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.currentTarget);

		const formEmail: string = formData.get("email") as string;
		const formPassword: string = formData.get("password") as string;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (formEmail === "") {
			setInputEmailVal({
				message: "Email não pode estar vazio.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formPassword === "") {
			setInputPasswordVal({
				message: "Senha não pode estar vazia.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (!emailRegex.test(formEmail)) {
			setInputEmailVal({
				message: "Email digitado é inválido.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		const signInResult: SignInResponse | undefined = await signIn(
			"credentials",
			{
				email: formData.get("email"),
				password: formData.get("password"),
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
		router.push("/finish");
	}

	return (
		<div className="flex w-full h-dvh items-center justify-center">
			<div className="flex flex-col gap-y-6 w-full max-w-[400px] px-4">
				<LogoTitle />
				<h2>Login</h2>
				<form className="gap-y-6 flex flex-col" onSubmit={handleLogin}>
					<Input
						placeholder="Email"
						type="text"
						name="email"
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
					<div>
						<Input
							placeholder="Senha"
							type="password"
							variant="bordered"
							name="password"
							classNames={{ inputWrapper: "h-14" }}
							startContent={
								<KeyIcon className="h-6 text-neutral-500" />
							}
							isInvalid={inputPasswordVal.active}
							errorMessage={inputPasswordVal.message}
							onValueChange={() => {
								setInputPasswordVal({
									message: "",
									active: false,
								});
							}}
						/>
					</div>
					<div>
						<p className="text-center">
							<Link href="/reset-password">
								Esqueceu sua senha?
							</Link>
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
			</div>
		</div>
	);
}
