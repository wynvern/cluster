"use client";

import LogoTitle from "@/components/sign/LogoTitle";
import completeProfile from "@/lib/db/complete-profile/completeProfile";
import { CheckIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { Button, Input, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import words from "../../../public/randomWords.json";

export default function Finish() {
	const { update } = useSession();
	const router = useRouter();
	const [inputValidation, setInputValidation] = useState({
		message: "",
		active: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const session = useSession();
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		// TODO: Chech if this is going to work
		if (session.data?.user.username) {
			router.push("/");
		}
	}, [session, router]);

	async function assignRandomUsername() {
		setIsLoading(true);

		const word1 =
			words.adjectives[
				Math.floor(Math.random() * words.adjectives.length)
			];
		const word2 =
			words.subjects[Math.floor(Math.random() * words.subjects.length)];
		const generatedUsername = `${word1}.${word2}`;

		const data = await completeProfile(generatedUsername);
		setIsLoading(false);

		switch (data) {
			case "no-session":
				setInputValidation({
					active: true,
					message: "Sessão inválida",
				});
				break;
			case "invalid-username":
				setInputValidation({
					active: true,
					message: "Nome de usuário inválido",
				});
				break;
			case "username-in-use":
				setInputValidation({
					active: true,
					message: "Nome de usuário em uso",
				});
				break;
			case "username-set":
				setSuccess(true);
				update({ username: generatedUsername });
				break;
		}
	}

	async function handleFinish(e: React.FormEvent<HTMLFormElement>) {
		setIsLoading(true);
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const formUsername: string = formData.get("username") as string;

		setIsLoading(false);
		const data = await completeProfile(formUsername);

		switch (data) {
			case "no-session":
				setInputValidation({
					active: true,
					message: "Sessão inválida",
				});
				break;
			case "invalid-username":
				setInputValidation({
					active: true,
					message: "Nome de usuário inválido",
				});
				break;
			case "username-in-use":
				setInputValidation({
					active: true,
					message: "Nome de usuário em uso",
				});
				break;
			case "username-set":
				setSuccess(true);
				update({ username: formUsername });
				break;
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (session.data?.user.username) {
			router.push("/");
		}
	}, [session]);

	return (
		<div className="flex w-full h-dvh items-center justify-center">
			<div className="flex flex-col gap-y-6 w-full max-w-[400px] px-4">
				<LogoTitle />
				<h2 className="w-[280px]">Complete seu perfil</h2>
				<form className="gap-y-6 flex flex-col" onSubmit={handleFinish}>
					<Input
						placeholder="Nome de usuário"
						type="text"
						name="username"
						variant="bordered"
						isInvalid={inputValidation.active}
						errorMessage={inputValidation.message}
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<>
								<UserIcon className="h-6 text-neutral-500" />
							</>
						}
						onValueChange={() => {
							setInputValidation({
								active: false,
								message: "",
							});
						}}
					/>

					<div className="flex items-center justify-between">
						<div>
							<Link onClick={assignRandomUsername}>
								Gerar nome aleatório
							</Link>
						</div>
						<Button
							type="submit"
							color={success ? "success" : "primary"}
							isLoading={isLoading}
							startContent={
								<>
									{isLoading ? (
										""
									) : success ? (
										<CheckIcon className="h-6" />
									) : (
										<CheckIcon className="h-6" />
									)}
								</>
							}
						>
							Confirmar
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
