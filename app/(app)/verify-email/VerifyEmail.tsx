import LogoTitle from "@/components/sign/LogoTitle";
import { verifyEmail } from "@/lib/db/verifyEmail/verifyEmail";
import { AtSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Button, Input, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail({ onReturn }: { onReturn: () => void }) {
	const [inputError, setInputError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const { update } = useSession();
	const router = useRouter();
	const session = useSession();

	async function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const formCode: string = formData.get("code") as string;

		if (!formCode) {
			setInputError("Digite o código");
			return false;
		}

		const data = await verifyEmail(formCode);

		setLoading(false);
		switch (data) {
			case "email-verified":
				setSuccess(true);
				update({ emailVerified: new Date() });
				break;
			case "invalid-code":
				setInputError("Código inválido.");
				break;
			case "invalid-email":
				setInputError("Email inválido.");
				break;
			case "code-expired":
				setInputError("Código expirado. Volte e gere um código novo.");
				break;
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (session.data?.user?.emailVerified) {
			router.push("/login"); // auto redirects to correct page
		}
	}, [session]);

	return (
		<div className="flex w-full h-dvh items-center justify-center">
			<div className="flex flex-col gap-y-6 w-full max-w-[400px] px-4">
				<LogoTitle />
				<div>
					<h2>Verificar Email</h2>
					<p>
						Digite o código de verificação enviado para o seu email.
					</p>
				</div>
				<form
					className="gap-y-6 flex flex-col"
					onSubmit={handleVerifyCode}
				>
					<Input
						name="code"
						placeholder="Código"
						startContent={<AtSymbolIcon className="h-6" />}
						errorMessage={inputError}
						isInvalid={Boolean(inputError)}
						classNames={{ inputWrapper: "h-14" }}
						onChange={() => setInputError("")}
						variant="bordered"
					/>
					<div className="flex items-center justify-between">
						<Link onClick={() => onReturn()}>Voltar</Link>
						<Button
							type="submit"
							color={success ? "success" : "primary"}
							isLoading={loading}
							startContent={
								loading ? (
									""
								) : success ? (
									<CheckIcon className="h-6" />
								) : (
									<CheckIcon className="h-6" />
								)
							}
						>
							{success ? "Verificado" : "Verificar"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
