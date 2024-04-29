import {
	AtSymbolIcon,
	CheckIcon,
	CubeIcon,
	PencilIcon,
	PencilSquareIcon,
	PhotoIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Chip, Image, Input, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import type Group from "@/lib/db/group/type";
import { uploadGroupBanner, uploadGroupImage } from "@/lib/blob/groupBlob";
import getFileBase64 from "@/util/getFile";
import { createGroup } from "@/lib/db/group/group";

interface CreateGroupProps {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateGroup({ active, setActive }: CreateGroupProps) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [categories, setCategories] = useState<string[]>([]);
	const [category, setCategory] = useState<string>("");
	const [errors, setErrors] = useState({
		name: "",
		description: "",
		groupname: "",
		categories: "",
	});
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
		const groupname = form.get("groupname") as string;
		const description = form.get("description") as string;

		if (!groupname) {
			setErrors((prev) => ({
				...prev,
				groupname: "Nome do grupo é obrigatório",
			}));
			setLoading(false);
			return false;
		}

		if (categories.length < 1) {
			setErrors((prev) => ({
				...prev,
				categories: "Adicione pelo menos uma categoria",
			}));
			setLoading(false);
			return false;
		}

		const data = await createGroup(
			name,
			groupname,
			description,
			categories
		);

		alert(data);

		switch (data) {
			case "no-session":
				setLoading(false);
				return false;

			case "groupname-in-use":
				setErrors((prev) => ({
					...prev,
					groupname: "Nome do grupo já está em uso",
				}));
				setLoading(false);
				return false;

			case "invalid-groupname":
				setErrors((prev) => ({
					...prev,
					groupname: "Nome do grupo inválido",
				}));
				setLoading(false);
				return false;
		}

		if (selectedImages.image.base64) {
			await uploadGroupImage(data, selectedImages.image.base64);
		}
		if (selectedImages.banner.base64) {
			await uploadGroupBanner(data, selectedImages.banner.base64);
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
			setCategories([]);
			setSuccess(false);
			setLoading(false);
		}
	}, [active]);

	return (
		<BaseModal
			title="Criar Grupo"
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
							src={selectedImages.banner.preview}
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
								name="groupname"
								placeholder="Nome do Grupo"
								variant="bordered"
								classNames={{ inputWrapper: "h-14" }}
								startContent={
									<AtSymbolIcon className="h-6 text-neutral-500" />
								}
								max={20}
								errorMessage={errors.groupname}
								isInvalid={errors.groupname !== ""}
								onValueChange={() => {
									setErrors((prev) => ({
										...prev,
										groupname: "",
									}));
								}}
							/>
							<Input
								placeholder="Categorias"
								variant="bordered"
								classNames={{ inputWrapper: "h-14" }}
								startContent={
									<CubeIcon className="h-6 text-neutral-500" />
								}
								errorMessage={errors.categories}
								isInvalid={errors.categories !== ""}
								max={20}
								value={category}
								onValueChange={(e) => {
									if (e.includes(" ")) {
										if (categories.length > 4) {
											return false; // TODO: handle error
										}

										setCategories([
											...categories,
											e.trim(),
										]);

										setErrors((prev) => ({
											...prev,
											categories: "",
										}));

										setCategory("");
									} else setCategory(e);
								}}
							/>
							{categories.length >= 1 ? (
								<div className="flex gap-y-2 gap-x-2 overflow-x-auto">
									{categories.map((category, index) => (
										<Chip
											key={category}
											onClose={() => {
												setCategories(
													categories.filter(
														(_, i) => i !== index
													)
												);
											}}
										>
											{category}
										</Chip>
									))}
								</div>
							) : (
								""
							)}
							<Input
								name="name"
								placeholder="Nome"
								variant="bordered"
								classNames={{ inputWrapper: "h-14" }}
								startContent={
									<PencilIcon className="h-6 text-neutral-500" />
								}
								max={50}
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
