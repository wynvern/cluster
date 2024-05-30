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
import { type Key, useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import type Group from "@/lib/db/group/type";
import ErrorBox from "../general/ErrorBox";
import supportedFormats from "@/public/supportedFormats.json";
import getFileBase64 from "@/util/getFile";
import { createPost } from "@/lib/db/post/post";
import { useConfirmationModal } from "../provider/ConfirmationModal";
import Draggable from "../general/Draggable";
import markdownit from "markdown-it";
import MarkdownIt from "markdown-it";

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

function documentFileBase64(
	file: File
): Promise<{ base64: string; file: File }> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result as string;
			resolve({ base64, file });
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

interface FileBase64Info {
	base64: string;
	preview: string;
	fileType: string;
}

interface DocumentFileBase64 {
	base64: string;
	file: File | undefined;
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
	const [activeTab, setActiveTab] = useState("text");
	const [selectedImages, setSelectedImages] = useState<FileBase64Info[]>([]);
	const [selectedDocuments, setSelectedDocuments] = useState<
		DocumentFileBase64[]
	>([]);
	const [errors, setErrors] = useState({
		title: "",
		content: "",
		media: "",
		document: "",
	});
	const { confirm } = useConfirmationModal();

	function validateInputs() {
		let hasError = false;
		let newErrors = { ...errors };

		if (title.length < 1) {
			newErrors = {
				...newErrors,
				title: "Título é obrigatório.",
			};
			hasError = true;
		}

		if (content.length < 1) {
			newErrors = {
				...newErrors,
				content: "Conteúdo é obrigatório.",
			};
			hasError = true;
		}

		setErrors(newErrors);
		return hasError;
	}

	async function handleCreatePost() {
		setLoading(true);

		if (validateInputs()) {
			setLoading(false);
			return false;
		}

		const data = await createPost(
			title,
			mdParser.render(content),
			selectedImages.map((i) => ({
				base64: i.base64,
				fileType: i.fileType,
			})),
			selectedDocuments.map((d) => d.base64),
			group.id
		);

		switch (data) {
			case "no-session":
				setErrors({
					...errors,
					content: "Você precisa estar logado para criar um post.",
				});
				break;
		}

		setLoading(false);
		setSuccess(true);
		setTimeout(() => setActive(false), 3000);
	}

	useEffect(() => {
		if (!active) {
			setSelectedImages([]);
			setSuccess(false);
			setLoading(false);
			setTitle("");
			setContent("");
			setSelectedDocuments([]);
		}
	}, [active]);

	// TODO: MAKE BETTER

	async function handleSelectMedia() {
		try {
			const file = await getFileBase64([
				"png",
				"jpg",
				"jpeg",
				"webp",
				"gif",
				"mp4",
			]);
			setSelectedImages((prev) => [...prev, file]);
		} catch (error) {
			console.error("Error while selecting media:", error);
		}
	}

	function onClosing() {
		if (
			!title &&
			!content &&
			!selectedImages.length &&
			!selectedDocuments.length
		) {
			setActive(false);
			return;
		}

		confirm({
			description:
				"Tem certeza que deseja sair? Seus dados não serão salvos.",
			title: "Cancelar criação de post",
			onCancel: () => {},
			onConfirm: () => setActive(false),
		});
	}

	async function handleSelectDocument() {
		try {
			const file = await getFileBase64(supportedFormats.document, 4.5, {
				file: true,
			});
			if (!file.file) return false;
			setSelectedDocuments((prev) => [
				...prev,
				{ ...file, file: file.file },
			]);
		} catch (error) {
			if ((error as { message: string }).message === "image-too-big") {
				setErrors({
					...errors,
					document: "Arquivo muito grande.",
				});
				setTimeout(() => {
					setErrors({
						...errors,
						document: "",
					});
				}, 3000);
			} else if (
				(error as { message: string }).message === "Invalid file type"
			) {
				setErrors({
					...errors,
					document: "Tipo de arquivo inválido.",
				});
				setTimeout(() => {
					setErrors({
						...errors,
						document: "",
					});
				}, 3000);
			}
		}
	}

	const mdParser = new MarkdownIt();

	return (
		<BaseModal
			title={`Criar Post em g/${group.groupname}`}
			size="2xl"
			active={active}
			setActive={onClosing}
			body={
				<>
					<Tabs
						selectedKey={activeTab}
						onSelectionChange={(key: Key) =>
							setActiveTab(key as string)
						}
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
							key="text"
							title={
								<div className="flex items-center space-x-2">
									<ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
									<span>Texto</span>
								</div>
							}
						>
							<div className="gap-y-3 flex flex-col min-h-[370px]">
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
									onValueChange={(e: string) => {
										setTitle(e);
										setErrors({
											...errors,
											title: "",
										});
									}}
									isDisabled={loading}
									isInvalid={Boolean(errors.title)}
									errorMessage={errors.title}
								/>
								<Textarea
									name="content"
									placeholder="Digite aqui"
									variant="bordered"
									classNames={{
										innerWrapper: "py-2 min-h-80",
									}}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
									}
									maxLength={1500} // TODO: See a good value
									value={content}
									isInvalid={Boolean(errors.content)}
									errorMessage={errors.content}
									onValueChange={(e: string) => {
										setContent(e);
										setErrors({
											...errors,
											content: "",
										});
									}}
									isDisabled={loading}
								/>
								<p className="text-tiny text-neutral-500">
									Suporte a markdown
								</p>
								<div>
									{content.length > 1000 ? (
										<p className="text-neutral-500">
											{content.length} / 1500
										</p>
									) : (
										""
									)}
								</div>
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
								<ScrollShadow className="flex flex-col w-full relative px-3 pt-3">
									{/* Upload image */}
									<Draggable
										onFileDrag={(file) => {
											if (selectedImages.length >= 6) {
												setErrors({
													...errors,
													media: "Você atingiu o limite de 6 imagens.",
												});
											}

											setSelectedImages((prev) => [
												...prev,
												{
													base64: file.base64,
													preview: file.preview,
													fileType: file.fileType,
												},
											]);
										}}
										acceptedTypes={supportedFormats.image}
									>
										<div
											className={
												"w-full h-40 rounded-large drop-zone transition-colors default-border"
											}
										>
											<div className="h-full w-full flex items-center justify-center">
												<div className="flex items-center flex-col gap-y-2 my-10">
													<CloudArrowUpIcon className="h-20 w-20" />
													<p>
														Arraste ou{" "}
														<Button
															onClick={
																handleSelectMedia
															}
															isDisabled={
																loading ||
																selectedImages.length >=
																	5
															}
															color="secondary"
															className="text-foreground"
														>
															<b>clique aqui</b>
														</Button>{" "}
														para adicionar mídia.
													</p>
												</div>
											</div>
										</div>
									</Draggable>
									<ErrorBox
										className="mt-3"
										error={errors.media}
										isVisible={Boolean(errors.media)}
									/>
									{selectedImages.length < 1 && (
										<p className="text-neutral-600 text-center mt-3">
											Suas imagens aparecerão aqui.
										</p>
									)}
									<div className="grid grid-cols-3 gap-3 mt-3">
										{selectedImages.map((item, index) => (
											<div
												key={item.preview}
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
							<div className="flex h-80 w-full overflow-y-auto min-h-[370px]">
								<ScrollShadow className="flex flex-col w-full relative px-3 pt-3">
									{/* Upload image */}
									<Draggable
										onFileDrag={(file) => {
											if (selectedDocuments.length >= 6) {
												setErrors({
													...errors,
													document:
														"Você atingiu o limite de 6 documentos.",
												});
											}

											setSelectedDocuments((prev) => [
												...prev,
												{
													base64: file.base64,
													file: file.file,
												},
											]);
										}}
										acceptedTypes={
											supportedFormats.document
										}
									>
										<div
											className={
												"w-full h-40 rounded-large drop-zone transition-colors default-border"
											}
										>
											<div className="h-full w-full flex items-center justify-center">
												<div className="flex items-center flex-col gap-y-2 my-10">
													<CloudArrowUpIcon className="h-20 w-20" />
													<p>
														Arraste ou{" "}
														<Button
															onClick={
																handleSelectDocument
															}
															isDisabled={
																loading ||
																selectedDocuments.length >=
																	6
															}
															color="secondary"
															className="text-foreground"
														>
															<b>clique aqui</b>
														</Button>{" "}
														para adicionar
														documentos.
													</p>
												</div>
											</div>
										</div>
									</Draggable>
									<ErrorBox
										className="mt-3"
										error={errors.document}
										isVisible={Boolean(errors.document)}
									/>
									<div className="flex flex-col gap-y-3 mt-3">
										{selectedDocuments.length < 1 && (
											<p className="text-neutral-600 text-center">
												Seus documentos aparecerão aqui.
											</p>
										)}
										{selectedDocuments.map(
											(item, index) => (
												<div
													key={item.file?.name}
													className="bg-neutral-800 relative rounded-large w-full flex p-3 justify-between flex items-center"
												>
													<div className="flex gap-x-4">
														<DocumentIcon className="h-6 w-6" />
														<p>{item.file?.name}</p>
													</div>
													<div>
														<Button
															color="secondary"
															size="sm"
															isIconOnly={true}
															onClick={() => {
																const newDocument =
																	[
																		...selectedDocuments,
																	];
																newDocument.splice(
																	index,
																	1
																);
																setSelectedDocuments(
																	newDocument
																);
															}}
														>
															<XMarkIcon className="h-6" />
														</Button>
													</div>
												</div>
											)
										)}
									</div>
								</ScrollShadow>
							</div>
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
						onClick={() => onClosing()}
					>
						Cancelar
					</Button>
					<Button
						color={success ? "success" : "primary"}
						onClick={handleCreatePost}
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
