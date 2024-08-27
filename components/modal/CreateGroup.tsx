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
import { uploadGroupBanner, uploadGroupImage } from "@/lib/blob/groupBlob";
import getFileBase64 from "@/util/getFile";
import { useRouter } from "next/navigation";
import Draggable from "../general/Draggable";
import { image } from "@/public/supportedFormats.json";
import { createGroup } from "@/lib/db/group/groupManagement";
import supportedCategories from "@/public/categories.json";

interface CreateGroupProps {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateGroup({ active, setActive }: CreateGroupProps) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [categories, setCategories] = useState<string[]>([]);
	const [category, setCategory] = useState<string>("");
	const router = useRouter();
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

	function matchCategory(e: string) {
		const category = supportedCategories.find(
			(i) => i.toLowerCase() === e.toLowerCase()
		);
		return !!category;
	}

	function handleAddCategory(e: string) {
		setErrors((prev) => ({
			...prev,
			categories: "",
		}));

		if (!e.includes(" ")) {
			setCategory(e);
			return;
		}

		if (categories.length > 4) {
			setErrors((prev) => ({
				...prev,
				categories: "Limite de categorias atingido",
			}));
			setTimeout(() => {
				setErrors((prev) => ({
					...prev,
					categories: "",
				}));
			}, 3000);

			return false;
		}

		if (categories.includes(e.trim())) {
			setCategory("");
			return;
		}

		if (matchCategory(e.trim())) {
			setCategories([...categories, e.trim()]);
			setCategory("");
		} else {
			setErrors((prev) => ({
				...prev,
				categories: "Categoria inválida",
			}));
		}
	}

	function validateInputs(groupname: string, categories: string[]) {
		const throwErrors = {
			name: "",
			description: "",
			groupname: "",
			categories: "",
		};

		if (!groupname) {
			throwErrors.groupname = "Nome do grupo é obrigatório";
		}

		if (categories.length === 0) {
			throwErrors.categories = "Adicione pelo menos uma categoria";
		}

		// Update the state with the errors
		setErrors(throwErrors);

		// Check if there are any errors by looking for non-empty error messages in throwErrors
		const hasErrors = Object.values(throwErrors).some(
			(error) => error !== ""
		);
		return !hasErrors; // Return true if there are no errors, false otherwise
	}

	async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const name = form.get("name") as string;
		const groupname = form.get("groupname") as string;
		const description = form.get("description") as string;

		if (!validateInputs(groupname, categories)) {
			setLoading(false);
			return;
		}

		const data = await createGroup(
			name,
			groupname,
			description,
			categories
		);

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

			case "no-data":
		}

		if (selectedImages.image.base64) {
			await uploadGroupImage(data, selectedImages.image.base64);
		}
		if (selectedImages.banner.base64) {
			await uploadGroupBanner(data, selectedImages.banner.base64);
		}

		setLoading(false);
		setSuccess(true);
		router.push(`/group/${groupname}`);
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
			setErrors({
				name: "",
				description: "",
				groupname: "",
				categories: "",
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
						className="w-full flex items-center justify-center rounded-large relative"
						style={{
							aspectRatio: "1000 / 400",
						}}
					>
						<Draggable
							onFileDrag={(file) => {
								if (Array.isArray(file)) return;

								setSelectedImages((prev) => ({
									banner: { ...file, error: "" },
									image: prev.image,
								}));
							}}
							acceptedTypes={image}
						>
							<div className="w-full h-full absolute bg-neutral-500 ">
								<Image
									removeWrapper={true}
									src={selectedImages.banner.preview || ""}
									className="absolute w-full h-full object-cover z-1"
								/>
							</div>
						</Draggable>
						<Button
							isIconOnly={true}
							className="opacity-80"
							onClick={handleSelectBanner}
							color="secondary"
						>
							<PhotoIcon className="h-6" />
						</Button>
						<Draggable
							onFileDrag={(file) => {
								if (Array.isArray(file)) return;

								setSelectedImages((prev) => ({
									banner: prev.banner,
									image: { ...file, error: "" },
								}));
							}}
							acceptedTypes={image}
						>
							<div className="absolute -bottom-10 left-4 flex items-center justify-center">
								<Button
									isIconOnly={true}
									className="absolute opacity-80 z-50"
									onClick={handleSelectimage}
									color="secondary"
								>
									<PhotoIcon className="h-6" />
								</Button>
								<Image
									className="h-[100px] sm:h-[140px] w-[100px] sm:w-[140px] object-cover z-1"
									src={
										selectedImages.image.preview ||
										"/brand/default-group.svg"
									}
									removeWrapper={true}
								/>
							</div>
						</Draggable>
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
							{/* Categories system made by a furry */}
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
								onValueChange={(e: string) =>
									handleAddCategory(e)
								}
								onKeyDown={(
									e: React.KeyboardEvent<HTMLInputElement>
								) => {
									if (e.key === "Enter") {
										e.preventDefault();
									}
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
								placeholder="Descrição"
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
