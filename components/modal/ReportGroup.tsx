import { Button, Input, Textarea } from "@nextui-org/react";
import BaseModal from "./BaseModal";
import { CheckIcon, FlagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { reportGroup } from "@/lib/db/group/groupManagement";

export default function ReportGroup({
	groupname,
	active,
	setActive,
}: {
	groupname: string | null;
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [inputError, setInputError] = useState({ title: "", content: "" });

	async function handleReportGroup(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();
		if (!groupname) return;

		const form = new FormData(e.currentTarget);
		const title = form.get("title") as string;
		const content = form.get("content") as string;

		if (!title) {
			setInputError((prev) => ({
				...prev,
				title: "Título é obrigatório",
			}));
		}

		if (!content) {
			setInputError((prev) => ({
				...prev,
				content: "Razão é obrigatória",
			}));
		}

		if (!title || !content) {
			setLoading(false);
			return;
		}

		const response = await reportGroup(groupname, { title, content });

		switch (response) {
			case "ok":
				setSuccess(true);
				break;
			case "no-session":
				break;
			case "no-group":
				break;
		}

		setLoading(false);
		setTimeout(() => setActive(false), 2000);
	}

	useEffect(() => {
		if (!active) {
			setSuccess(false);
			setInputError({ title: "", content: "" });
		}
	}, [active]);

	return (
		<div>
			<BaseModal
				title={`Reportar g/${groupname}`}
				size="xl"
				active={active}
				setActive={setActive}
				body={
					<>
						<form
							onSubmit={handleReportGroup}
							className="flex gap-y-3 flex-col"
							id="report-profile"
						>
							<Input
								name="title"
								placeholder="Título"
								variant="bordered"
								max={100}
								errorMessage={inputError.title}
								isInvalid={inputError.title !== ""}
							/>
							<Textarea
								variant="bordered"
								placeholder="Razão"
								name="content"
								max={500}
								errorMessage={inputError.content}
								isInvalid={inputError.content !== ""}
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
