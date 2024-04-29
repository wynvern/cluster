import {
	CheckIcon,
	PencilIcon,
	PencilSquareIcon,
	PhotoIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Image, Input, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import type Group from "@/lib/db/group/type";
import { updateGroup } from "@/lib/db/group/group";
import getFileBase64 from "@/util/getFile";
import { uploadGroupBanner, uploadGroupImage } from "@/lib/blob/groupBlob";

interface CustomizeGroupProps {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	defaultGroup: Group;
}

export default function CustomizeGroup({
	active,
	setActive,
	defaultGroup,
}: CustomizeGroupProps) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const [selectedImages, setSelectedImages] = useState({
		image: {
			base64: "",
			preview: "",
			error: "",
		},
		banner: {
			base64: "",
			preview: "",
			error: "",
		},
	});

	async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const name = form.get("name") as string;
		const description = form.get("description") as string;

		if (selectedImages.image.base64) {
			await uploadGroupImage(
				defaultGroup.id,
				selectedImages.image.base64
			);
		}
		if (selectedImages.banner.base64) {
			await uploadGroupBanner(
				defaultGroup.id,
				selectedImages.banner.base64
			);
		}

		const data = await updateGroup(defaultGroup.id, name, description);

		if (!data) {
			// handle error
		}

		setLoading(false);
		setSuccess(true);
		setTimeout(() => setActive(false), 1000);
	}

	async function handleSelectBanner() {
		try {
			const data = await getFileBase64(["jpg", "jpeg", "png", "webp"]);

			if (!data) return false;

			setSelectedImages((prev) => ({
				...prev,
				banner: { ...data, error: "" },
			}));
		} catch (e) {
			if ((e as { message: string }).message === "image-too-big") {
				setSelectedImages((prev) => ({
					banner: { base64: "", preview: "", error: "image-too-big" },
					image: prev.image,
				}));
				setTimeout(() => {
					setSelectedImages((prev) => ({
						banner: { base64: "", preview: "", error: "" },
						image: prev.image,
					}));
				}, 3000);
			}
		}
	}

	async function handleSelectimage() {
		try {
			const data = await getFileBase64(["jpg", "jpeg", "png", "webp"]);

			if (!data) return false;

			setSelectedImages((prev) => ({
				...prev,
				image: { ...data, error: "" },
			}));
		} catch (e) {
			if ((e as { message: string }).message === "image-too-big") {
				setSelectedImages((prev) => ({
					image: { base64: "", preview: "", error: "image-too-big" },
					banner: prev.banner,
				}));
				setTimeout(() => {
					setSelectedImages((prev) => ({
						image: { base64: "", preview: "", error: "" },
						banner: prev.banner,
					}));
				}, 3000);
			}
		}
	}

	useEffect(() => {
		if (!active) {
			setSelectedImages({
				image: {
					base64: "",
					preview: "",
					error: "",
				},
				banner: {
					base64: "",
					preview: "",
					error: "",
				},
			});
			setSuccess(false);
			setLoading(false);
		}
	}, [active]);

	return (
		<BaseModal
			title="Customizar grupo"
			size="xl"
			active={active}
			setActive={setActive}
			body={
				<>
					<div
						className="w-full bg-default-500 flex items-center justify-center rounded-large relative"
						style={{
							aspectRatio: "1000 / 400",
						}}
					>
						<Image
							removeWrapper={true}
							src={
								defaultGroup.banner ||
								selectedImages.banner.preview
							}
							className="absolute w-full h-full object-cover z-1"
						/>
						<Button
							isIconOnly={true}
							className="opacity-80"
							onClick={handleSelectBanner}
						>
							<PhotoIcon className="h-6" />
						</Button>
						<div className="absolute -bottom-10 left-10 flex items-center justify-center">
							<Button
								isIconOnly={true}
								className="absolute opacity-80 z-50"
								onClick={handleSelectimage}
							>
								<PhotoIcon className="h-6" />
							</Button>
							<Image
								className="h-[140px] w-[140px] object-cover z-1"
								src={
									defaultGroup.image ||
									selectedImages.image.preview ||
									"/brand/default-group.svg"
								}
								removeWrapper={true}
							/>
						</div>
					</div>
					<div className="mt-11">
						<form
							className="flex gap-y-3 flex-col"
							id="update-profile-form"
							onSubmit={handleUpdateProfile}
						>
							{selectedImages.image.error ||
								(selectedImages.banner.error && (
									<div className="bg-red-950 rounded-large p-2 pl-4 flex items-center">
										<p className="text-danger">
											Imagem selecionada muito grande,
											máximo 4.5 MB
										</p>
									</div>
								))}
							<Input
								name="name"
								placeholder="Nome"
								variant="bordered"
								classNames={{ inputWrapper: "h-14" }}
								startContent={
									<PencilIcon className="h-6 text-neutral-500" />
								}
								max={50}
								defaultValue={defaultGroup.name || ""}
							/>
							<Textarea
								name="description"
								placeholder="descriptiongrafia"
								variant="bordered"
								classNames={{
									innerWrapper: "py-[9px]",
									input: "mt-[2px]",
								}}
								max={200}
								defaultValue={defaultGroup.description || ""}
								startContent={
									<PencilIcon className="h-6 text-neutral-500" />
								}
							/>
						</form>
					</div>
				</>
			}
			footer={
				<>
					<Button
						aria-label="cancelar-grupo"
						isDisabled={loading || success}
						startContent={<XMarkIcon className="h-6" />}
						variant="bordered"
						onClick={() => setActive(false)}
					>
						Cancelar
					</Button>
					<Button
						color={success ? "success" : "primary"}
						type="submit"
						form="update-profile-form"
						isLoading={loading}
						isDisabled={loading || success}
						aria-label="salvar-grupo"
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
						Salvar
					</Button>
				</>
			}
		/>
	);
}
