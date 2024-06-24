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
import { updateUser } from "@/lib/db/user/user";
import { uploadUserAvatar, uploadUserBanner } from "@/lib/blob/userBlob";
import type User from "@/lib/db/user/type";
import getFileBase64 from "@/util/getFile";
import Draggable from "../general/Draggable";
import { useSession } from "next-auth/react";

interface CustomizeProfileProps {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	user: User;
	onUpdate: () => void;
}

export default function CustomizeProfile({
	active,
	setActive,
	user,
	onUpdate,
}: CustomizeProfileProps) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const { update } = useSession();

	const [selectedImages, setSelectedImages] = useState({
		avatar: {
			base64: "",
			preview: "",
			error: "",
			fileType: "",
		},
		banner: {
			base64: "",
			preview: "",
			error: "",
			fileType: "",
		},
	});

	async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const name = form.get("name") as string;
		const bio = form.get("bio") as string;

		if (selectedImages.avatar.base64) {
			const response = await uploadUserAvatar(
				selectedImages.avatar.base64,
				selectedImages.avatar.fileType
			);
			if (typeof response !== "string") {
				update({ image: response.url });
			}
		}
		if (selectedImages.banner.base64) {
			await uploadUserBanner(
				selectedImages.banner.base64,
				selectedImages.banner.fileType
			);
		}

		const data = await updateUser(name, bio);

		if (!data) {
			// TODO: handle error
		}

		setLoading(false);
		setSuccess(true);
		onUpdate();
	}

	async function handleSelectBanner() {
		try {
			const data = await getFileBase64([
				"jpg",
				"jpeg",
				"png",
				"webp",
				"gif",
			]);

			if (!data) return false;

			setSelectedImages((prev) => ({
				...prev,
				banner: { ...data, error: "" },
			}));
		} catch (e) {
			if ((e as { message: string }).message === "image-too-big") {
				setSelectedImages((prev) => ({
					banner: {
						base64: "",
						preview: "",
						error: "image-too-big",
						fileType: "",
					},
					avatar: prev.avatar,
				}));
				setTimeout(() => {
					setSelectedImages((prev) => ({
						banner: {
							base64: "",
							preview: "",
							error: "",
							fileType: "",
						},
						avatar: prev.avatar,
					}));
				}, 3000);
			}
		}
	}

	async function handleSelectAvatar() {
		try {
			const data = await getFileBase64([
				"jpg",
				"jpeg",
				"png",
				"webp",
				"gif",
			]);

			if (!data) return false;

			setSelectedImages((prev) => ({
				...prev,
				avatar: { ...data, error: "" },
			}));
		} catch (e) {
			if ((e as { message: string }).message === "image-too-big") {
				setSelectedImages((prev) => ({
					avatar: {
						base64: "",
						preview: "",
						error: "image-too-big",
						fileType: "",
					},
					banner: prev.banner,
				}));
				setTimeout(() => {
					setSelectedImages((prev) => ({
						avatar: {
							base64: "",
							preview: "",
							error: "",
							fileType: "",
						},
						banner: prev.banner,
					}));
				}, 3000);
			}
		}
	}

	useEffect(() => {
		if (!active) {
			setSelectedImages({
				avatar: {
					base64: "",
					preview: "",
					error: "",
					fileType: "",
				},
				banner: {
					base64: "",
					preview: "",
					error: "",
					fileType: "",
				},
			});
			setSuccess(false);
			setLoading(false);
		}
	}, [active]);

	return (
		<BaseModal
			title="Customizar Perfil"
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
								setSelectedImages((prev) => ({
									banner: { ...file, error: "" },
									avatar: prev.avatar,
								}));
							}}
							acceptedTypes={[
								"png",
								"jpg",
								"jpeg",
								"webp",
								"gif",
							]}
						>
							<div className="w-full h-full absolute bg-neutral-500 ">
								<Image
									removeWrapper={true}
									src={
										selectedImages.banner.preview ||
										user.banner ||
										""
									}
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
								setSelectedImages((prev) => ({
									banner: prev.banner,
									avatar: { ...file, error: "" },
								}));
							}}
							acceptedTypes={[
								"png",
								"jpg",
								"jpeg",
								"webp",
								"gif",
							]}
						>
							<div className="absolute -bottom-10 left-4 flex items-center justify-center">
								<Button
									isIconOnly={true}
									className="absolute opacity-80 z-50"
									onClick={handleSelectAvatar}
									color="secondary"
								>
									<PhotoIcon className="h-6" />
								</Button>
								<Image
									className="h-[100px] sm:h-[140px] w-[100px] sm:w-[140px] object-cover z-1"
									src={
										selectedImages.avatar.preview ||
										user.image ||
										"/brand/default-avatar.svg"
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
							{selectedImages.avatar.error ||
								(selectedImages.banner.error && (
									<div className="bg-red-950 rounded-large p-2 pl-4 flex items-center">
										<p className="text-danger">
											Imagem selecionada muito grande,
											máximo 4.5 Mb
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
								defaultValue={user.name || ""}
							/>
							<Textarea
								name="bio"
								placeholder="Biografia"
								variant="bordered"
								classNames={{
									innerWrapper: "py-[9px]",
									input: "mt-[2px]",
								}}
								max={200}
								defaultValue={user.bio || ""}
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
						aria-label="cancelar-perfil"
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
						aria-label="salvar-perfil"
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
