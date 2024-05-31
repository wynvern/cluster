import { Button, Textarea } from "@nextui-org/react";
import BaseModal from "./BaseModal";
import {
	CheckIcon,
	NoSymbolIcon,
	PencilIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { banMember } from "@/lib/db/group/groupMember";

export default function ({
	groupname,
	active,
	setActive,
	userId,
}: {
	groupname: string;
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	userId: string;
}) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [inputError, setInputError] = useState({ title: "", content: "" });

	async function handleBanMember(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const reason = form.get("reason") as string;

		if (!reason) {
			setInputError((prev) => ({
				...prev,
				content: "Razão é obrigatória",
			}));
		}

		await banMember({ groupname, userId, reason });

		setSuccess(true);
		setLoading(false);
		setTimeout(() => setActive(false), 2000);
	}

	return (
		<div>
			<BaseModal
				title={`Banir ${groupname}`}
				size="xl"
				active={active}
				setActive={setActive}
				body={
					<>
						<form
							onSubmit={handleBanMember}
							className="flex gap-y-3 flex-col"
							id="ban-profile"
						>
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
							form="ban-profile"
							isLoading={loading}
							isDisabled={loading || success}
							aria-label="salvar-perfil"
							startContent={
								loading ? (
									""
								) : success ? (
									<CheckIcon className="h-6" />
								) : (
									<NoSymbolIcon className="h-6" />
								)
							}
						>
							Banir
						</Button>
					</>
				}
			/>
		</div>
	);
}
