import { Button, Input, Textarea } from "@nextui-org/react";
import BaseModal from "./BaseModal";
import { CheckIcon, FlagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { reportPost } from "@/lib/db/post/post";

export default function ReportPost({
	postId,
	active,
	setActive,
}: {
	postId: string | null;
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [inputError, setInputError] = useState({ title: "", reason: "" });

	async function handleReportPost(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();
		if (!postId) return;

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

		const response = await reportPost(postId, title, reason);

		switch (response) {
			case "ok":
				setSuccess(true);
				setTimeout(() => setActive(false), 2000);
				break;
			case "no-session":
				break;
			case "no-post":
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
		<BaseModal
			title={"Reportar post"}
			size="xl"
			active={active}
			setActive={setActive}
			body={
				<>
					<form
						onSubmit={handleReportPost}
						className="flex gap-y-3 flex-col"
						id="report-post"
					>
						<Input
							name="title"
							label="Título"
							variant="bordered"
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
						form="report-post"
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
	);
}
