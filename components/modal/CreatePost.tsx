import {
	ChatBubbleBottomCenterTextIcon,
	CheckIcon,
	CloudArrowUpIcon,
	DocumentIcon,
	PencilIcon,
	PencilSquareIcon,
	PhotoIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Input,
	Link,
	ScrollShadow,
	Tab,
	Tabs,
	Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import getFileBase64 from "@/util/getFile";
import type Group from "@/lib/db/group/type";

function fileToBase64(
	file: File
): Promise<{ base64: string; preview: string }> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result as string;
			const preview = URL.createObjectURL(file);
			resolve({ base64, preview });
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

interface FileBase64Info {
	base64: string;
	preview: string;
}

interface CreatePostProps {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	group: Group;
}

export default function CreatePost({
	active,
	setActive,
	group,
}: CreatePostProps) {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedImages, setSelectedImages] = useState<FileBase64Info[]>([]);
	const [errors, setErrors] = useState({
		title: "",
		content: "",
		media: "",
	});

	async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
		setLoading(true);
		e.preventDefault();

		setLoading(false);
		setSuccess(true);
		setTimeout(() => setActive(false), 1000);
	}

	async function handleAddImage() {
		try {
			const data = await getFileBase64(["jpg", "jpeg", "png", "webp"]);

			if (!data) return false;

			setSelectedImages((prev) => [...prev, data]);
		} catch (e) {
			if ((e as { message: string }).message === "image-too-big") {
			}
		}
	}

	useEffect(() => {
		if (!active) {
			setSelectedImages([]);
			setSuccess(false);
			setLoading(false);
		}
	}, [active]);

	// TODO: MAKE BETTER

	async function handleSelectMedia() {
		try {
			const file = await getFileBase64(["png", "jpg", "jpeg", "webp"]);
			setSelectedImages((prev) => [...prev, file]);
		} catch (error) {
			console.error("Error while selecting media:", error);
		}
	}

	const [dragging, setDragging] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);

		const files = Array.from(e.dataTransfer.files);

		if (!files[0]) {
			return false;
		}

		if (
			!["jpeg", "jpg", "png", "webp"].includes(
				files[0].type.split("/")[1]
			)
		) {
			console.error("tipo não suportado"); // TODO: Better drag notifications
		}
		if (selectedImages.length >= 5) return false;

		const newMediaFile = await fileToBase64(files[0]);
		const newMedia = [...selectedImages, newMediaFile];
		setSelectedImages(newMedia);
	};

	return (
		<BaseModal
			title={`Criar Post em g/${group.groupname}`}
			size="2xl"
			active={active}
			setActive={setActive}
			body={
				<>
					<Tabs
						aria-label="Options"
						color="primary"
						disableAnimation={false}
						variant="underlined"
						classNames={{ tabList: "w-full" }}
						motionProps={{
							variants: {
								enter: {
									scale: 1,
									y: "var(--slide-enter)",
									opacity: 1,
									transition: {
										scale: {
											duration: 0.4,
											ease: [0.36, 0.66, 0.4, 1],
										},
										opacity: {
											duration: 0.4,
											ease: [0.36, 0.66, 0.4, 1],
										},
										y: {
											type: "spring",
											bounce: 0,
											duration: 0.6,
										},
									},
								},
								exit: {
									scale: 1.1, // NextUI default 1.03
									y: "var(--slide-exit)",
									opacity: 0,
									transition: {
										duration: 0.3,
										ease: [0.36, 0.66, 0.4, 1],
									},
								},
							},
						}}
					>
						<Tab
							key="post"
							title={
								<div className="flex items-center space-x-2">
									<ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
									<span>Post</span>
								</div>
							}
						>
							<div className="gap-y-3 flex flex-col">
								<Input
									name="title"
									variant="bordered"
									placeholder="Título"
									classNames={{
										inputWrapper: "h-14",
									}}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
									}
									maxLength={100}
									value={title}
									onValueChange={(e) => {
										setTitle(e);
										setErrors({
											...errors,
											title: "",
										});
									}}
									isDisabled={loading}
									isInvalid={Boolean(errors.title)}
									errorMessage={errors.title !== ""}
								/>
								<Textarea
									name="content"
									placeholder="Digite aqui"
									variant="bordered"
									classNames={{
										innerWrapper: "py-2 min-h-60",
									}}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
									}
									maxLength={1500} // TODO: See a good value
									value={content}
									isInvalid={Boolean(errors.content)}
									errorMessage={errors.content}
									onValueChange={(e) => {
										setContent(e);
										setErrors({
											...errors,
											content: "",
										});
									}}
									isDisabled={loading}
								/>
							</div>
						</Tab>
						<Tab
							key="media"
							title={
								<div className="flex items-center space-x-2">
									<PhotoIcon className="h-6 w-6" />
									<span>Mídia</span>
								</div>
							}
						>
							<div className="flex h-80 w-full overflow-y-auto min-h-[370px]">
								<ScrollShadow className="flex flex-col w-full relative">
									{/* Upload image */}
									<div
										className={`w-full h-40 rounded-large drop-zone transition-colors default-border duration-200 ${
											dragging ? "bg-primary" : ""
										}`}
										onDragOver={handleDragOver}
										onDragLeave={handleDragLeave}
										onDrop={handleDrop}
									>
										<div className="h-full w-full flex items-center justify-center">
											<div className="flex items-center flex-col gap-y-2 my-10">
												<CloudArrowUpIcon className="h-20 w-20" />
												<p>
													Arraste ou{" "}
													<Link
														onClick={
															handleSelectMedia
														}
														isDisabled={loading}
														className="text-foreground"
													>
														<b>clique aqui</b>
													</Link>{" "}
													para adicionar mídia.
												</p>
											</div>
										</div>
									</div>
									<div className="grid grid-cols-3 gap-3 mt-3">
										{selectedImages.map((item, index) => (
											<div
												key={item.base64}
												className="bg-default-100 relative rounded-large aspect-square flex p-3 bg-cover bg-center"
												style={{
													backgroundImage: `url(${item.preview})`,
												}}
											>
												<div>
													<Button
														color="secondary"
														size="sm"
														isIconOnly={true}
														onClick={() => {
															const newMedia = [
																...selectedImages,
															];
															newMedia.splice(
																index,
																1
															);
															setSelectedImages(
																newMedia
															);
														}}
													>
														<XMarkIcon className="h-6" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</ScrollShadow>
							</div>
						</Tab>
						<Tab
							key="documents"
							title={
								<div className="flex items-center space-x-2">
									<DocumentIcon className="h-6 w-6" />
									<span>Documentos</span>
								</div>
							}
						>
							Aqui ficam documentos
						</Tab>
					</Tabs>
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
						Criar
					</Button>
				</>
			}
		/>
	);
}
