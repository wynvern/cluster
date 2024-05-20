import { Button, Input, Textarea } from "@nextui-org/react";
import BaseModal from "./BaseModal";
import {
	CheckIcon,
	FlagIcon,
	PencilIcon,
	PencilSquareIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { reportProfile } from "@/lib/db/report/report";

export default function ReportProfile({
	username,
	active,
	setActive,
}: {
	username: string | null;
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [inputError, setInputError] = useState({ title: "", reason: "" });

	async function handleReportProfile(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();
		if (!username) return;

		const form = new FormData(e.currentTarget);
		const title = form.get("title") as string;
		const reason = form.get("reason") as string;

		if (!title) {
			setInputError((prev) => ({
				...prev,
				title: "Título é obrigatório",
			}));
		}

		if (!reason) {
			setInputError((prev) => ({
				...prev,
				reason: "Razão é obrigatória",
			}));
		}

		const response = await reportProfile(username, title, reason);

		switch (response) {
			case "ok":
				setSuccess(true);
				break;
			case "no-session":
				alert("Sessão inválida");
				break;
			case "no-user":
				alert("Usuário não encontrado");
				break;
			case "error":
				alert("Erro ao reportar usuário");
				break;
		}

		setLoading(false);
		setTimeout(() => setActive(false), 2000);
	}

	return (
		<div>
			<BaseModal
				title={`Reportar ${username}`}
				size="xl"
				active={active}
				setActive={setActive}
				body={
					<>
						<form
							onSubmit={handleReportProfile}
							className="flex gap-y-3 flex-col"
							id="report-profile"
						>
							<Input
								name="title"
								placeholder="Título"
								variant="bordered"
								classNames={{ inputWrapper: "h-14" }}
								startContent={
									<PencilIcon className="h-6 text-neutral-500" />
								}
								max={100}
								errorMessage={inputError.title}
								isInvalid={inputError.title !== ""}
							/>
							<Textarea
								variant="bordered"
								placeholder="Razão"
								name="reason"
								classNames={{
									innerWrapper: "py-[9px]",
									input: "mt-[2px]",
								}}
								max={500}
								startContent={
									<PencilIcon className="h-6 text-neutral-500" />
								}
								errorMessage={inputError.reason}
								isInvalid={inputError.reason !== ""}
							/>
						</form>
					</>
				}
				footer={
					<>
						<Button
							variant="bordered"
							startContent={<XMarkIcon className="h-6" />}
						>
							Cancelar
						</Button>
						<Button
							color={success ? "success" : "danger"}
							type="submit"
							form="report-profile"
							isLoading={loading}
							isDisabled={loading || success}
							aria-label="salvar-perfil"
							startContent={
								loading ? (
									""
								) : success ? (
									<CheckIcon className="h-6" />
								) : (
									<FlagIcon className="h-6" />
								)
							}
						>
							Reportar
						</Button>
					</>
				}
			/>
		</div>
	);
}
