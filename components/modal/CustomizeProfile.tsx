import {
	CheckIcon,
	PencilIcon,
	PencilSquareIcon,
	PhotoIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Image, Input, Textarea } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import BaseModal from "./BaseModal";
import { updateUser } from "@/lib/db/user/user";
import getFileBase64 from "@/util/getFile";
import { uploadUserAvatar } from "@/lib/blob/userBlob";
import getFileAndPreview from "@/util/getFile";

interface CustomizeProfileProps {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ImageState {
	file: File | null;
	preview: string;
}

export default function CustomizeProfile({
	active,
	setActive,
}: CustomizeProfileProps) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	async function handleSignOut() {
		setLoading(true);
		signOut();
	}

	const [selectedImages, setSelectedImages] = useState<{
		banner: ImageState;
		avatar: ImageState;
	}>({
		banner: { file: null, preview: "" },
		avatar: { file: null, preview: "" },
	});

	async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const name = form.get("name") as string;
		const bio = form.get("bio") as string;

		let avatarBase64: string | undefined;

		if (selectedImages.avatar.file) {
			avatarBase64 = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(selectedImages.avatar.file as File);
			});

			if (avatarBase64) await uploadUserAvatar(avatarBase64);
		}

		alert("ok");
		const data = await updateUser(name, bio);

		if (!data) {
			// handle error
		}

		console.log(data);

		setLoading(false);
	}

	async function handleSelectBanner() {
		const data = await getFileAndPreview(["jpg", "jpeg", "png", "webp"]);

		if (!data) return false;

		setSelectedImages((prev) => ({
			...prev,
			banner: data,
		}));

		console.log(selectedImages);
	}

	async function handleSelectAvatar() {
		const data = await getFileAndPreview(["jpg", "jpeg", "png", "webp"]);

		if (!data) return false;

		setSelectedImages((prev) => ({
			...prev,
			avatar: data,
		}));
	}

	return (
		<BaseModal
			title="Customizar Perfil"
			size="xl"
			active={active}
			setActive={setActive}
			body={
				<>
					<div
						className="w-full bg-default-500 flex items-center justify-center rounded-large relative"
						style={{
							aspectRatio: "1000 / 350",
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
								onClick={handleSelectAvatar}
							>
								<PhotoIcon className="h-6" />
							</Button>
							<Image
								className="h-[120px] w-[120px] object-cover z-1"
								src={
									selectedImages.avatar.preview ||
									"/brand/default-avatar.svg"
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
								name="bio"
								placeholder="Biografia"
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
						isLoading={loading}
						aria-label="cancelar-perfil"
						startContent={<XMarkIcon className="h-6" />}
						variant="bordered"
					>
						Cancelar
					</Button>
					<Button
						color={success ? "success" : "primary"}
						type="submit"
						form="update-profile-form"
						isLoading={loading}
						isDisabled={loading}
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
