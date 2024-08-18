import { Button, Input, Textarea } from "@nextui-org/react";
import BaseModal from "./BaseModal";
import {
	CheckIcon,
	FlagIcon,
	PencilIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { reportUser } from "@/lib/db/user/user";
import { toast } from "react-toastify";

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
			setLoading(false);
			return;
		}

		if (!reason) {
			setInputError((prev) => ({
				...prev,
				reason: "Razão é obrigatória",
			}));
			setLoading(false);
			return;
		}

		const response = await reportUser(username, title, reason);

		switch (response) {
			case "ok":
				setSuccess(true);
				setTimeout(() => setActive(false), 2000);
				break;
			case "no-session":
				break;
			case "no-user":
				break;
			case "error":
				break;
			case "already-reported":
				toast.error("Você já reportou este usuário", {
					autoClose: 3000,
				});
				break;
		}

		setLoading(false);
	}

	// clean everything
	useEffect(() => {
		if (!active) {
			setInputError({ title: "", reason: "" });
			setSuccess(false);
			setLoading(false);
		}
	}, [active]);

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
								label="Título"
								variant="bordered"
								classNames={{ inputWrapper: "h-14" }}
								max={100}
								errorMessage={inputError.title}
								isInvalid={inputError.title !== ""}
								onValueChange={() => {
									setInputError((prev) => ({
										...prev,
										title: "",
									}));
								}}
							/>
							<Textarea
								variant="bordered"
								label="Razão"
								name="reason"
								max={500}
								errorMessage={inputError.reason}
								isInvalid={inputError.reason !== ""}
								onValueChange={() => {
									setInputError((prev) => ({
										...prev,
										reason: "",
									}));
								}}
							/>
						</form>
					</>
				}
				footer={
					<>
						<Button
							variant="bordered"
							startContent={<XMarkIcon className="h-6" />}
							onClick={() => setActive(false)}
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
