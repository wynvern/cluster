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
import getFileBase64, {
	getFilesBase64,
	type FileBase64Info,
} from "@/util/getFile";
import { createPost } from "@/lib/db/post/post";
import Draggable from "../general/Draggable";
import MarkdownIt from "markdown-it";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
	const router = useRouter();
	const [selectedMedia, setSelectedMedia] = useState<FileBase64Info[]>([]);
	const [selectedDocuments, setSelectedDocuments] = useState<
		FileBase64Info[]
	>([]);
	const [errors, setErrors] = useState({
		title: "",
		content: "",
		media: "",
		document: "",
	});
	const mdParser = new MarkdownIt();
	const { confirm } = useConfirmationModal();

	function validateInputs() {
		let hasError = false;
		let newErrors = { ...errors };

		if (title.length < 1) {
			newErrors = {
				...newErrors,
				title: "Título é obrigatório.",
			};
			setActiveTab("text");
			hasError = true;
		}

		if (content.length < 1) {
			newErrors = {
				...newErrors,
				content: "Conteúdo é obrigatório.",
			};
			setActiveTab("text");
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

		const docToUpload = selectedDocuments.map((d) => ({
			fileName: d.file?.name,
			base64: d.base64,
			fileType: d.fileType,
		}));

		const data = await createPost(
			title,
			mdParser.render(content),
			selectedMedia.map((i) => ({
				base64: i.base64,
				fileType: i.fileType,
			})),
			docToUpload,
			group.id
		);

		if (typeof data === "string") {
			switch (data) {
				case "no-session":
					setErrors({
						...errors,
						content:
							"Você precisa estar logado para criar um post.",
					});
					break;
				default:
					toast.error("Erro ao criar post.", { autoClose: 3000 });
			}
			return;
		}

		setLoading(false);
		setSuccess(true);
		router.push(`/post/${data.id}`);
	}

	useEffect(() => {
		if (!active) {
			setSelectedMedia([]);
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
			const file = await getFilesBase64(
				supportedFormats.image,
				Number.parseInt(
					process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || "4.5"
				)
			);
			if (file.length + selectedMedia.length > 6) {
				return;
			}
			setSelectedMedia((prev) => [...prev, ...file]);
		} catch (error) {
			switch ((error as { message: string }).message) {
				case "file-too-large":
					toast.error(
						`Arquivo muito grande. Máximo de ${process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE} MB.`,
						{
							autoClose: 3000,
						}
					);
					break;
				case "invalid-file-type":
					toast.error("Tipo de arquivo inválido.", {
						autoClose: 3000,
					});
					break;
				default:
					toast.error("Erro ao adicionar imagem.", {
						autoClose: 3000,
					});
					break;
			}
		}
	}

	function onClosing() {
		if (
			!title &&
			!content &&
			!selectedMedia.length &&
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
			const file = await getFilesBase64(supportedFormats.document);
			if (file.length + selectedDocuments.length > 6) {
				return;
			}

			setSelectedDocuments((prev) => [...prev, ...file]);
		} catch (error) {
			switch ((error as { message: string }).message) {
				case "file-too-large":
					toast.error(
						`Arquivo muito grande. Máximo de ${process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE} MB.`,
						{
							autoClose: 3000,
						}
					);
					break;
				case "invalid-file-type":
					toast.error("Tipo de arquivo inválido.", {
						autoClose: 3000,
					});
					break;
				default:
					toast.error("Erro ao adicionar documento.", {
						autoClose: 3000,
					});
					break;
			}
		}
	}

	return (
		<BaseModal
			title={`Criar Post em g/${group.groupname}`}
			size="2xl"
			active={active}
			setActive={onClosing}
			body={
				<>
					{/* @ts-ignore */}
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
									label="Título"
									classNames={{
										inputWrapper: "h-14",
									}}
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
									label="Conteúdo"
									variant="bordered"
									classNames={{
										innerWrapper: "min-h-80",
									}}
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
										bulk={true}
										onFileDrag={(file) => {
											const filesArray = Array.isArray(
												file
											)
												? file
												: [file];

											if (
												selectedMedia.length +
													filesArray.length >
												6
											) {
												toast.error(
													"Você atingiu o limite de 6 imagens.",
													{ autoClose: 3000 }
												);
												return;
											}

											setSelectedMedia((prev) => [
												...prev,
												...filesArray,
											]);
										}}
										onError={(message) => {
											toast.error(message, {
												autoClose: 2000,
											});
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
														<Link
															onClick={() => {
																if (
																	!loading &&
																	selectedMedia.length <
																		5
																) {
																	handleSelectMedia();
																}
															}}
															className="text-foreground"
														>
															<b>clique aqui</b>
														</Link>{" "}
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
									{selectedMedia.length < 1 && (
										<p className="text-neutral-600 text-center mt-3">
											Suas imagens aparecerão aqui.
										</p>
									)}
									<div className="grid grid-cols-3 gap-3 mt-3">
										{selectedMedia.map((item, index) => (
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
																...selectedMedia,
															];
															newMedia.splice(
																index,
																1
															);
															setSelectedMedia(
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
									{/* Upload document */}
									<Draggable
										bulk={true}
										onFileDrag={(file) => {
											const filesArray = Array.isArray(
												file
											)
												? file
												: [file];

											if (
												selectedDocuments.length +
													filesArray.length >
												6
											) {
												toast.error(
													"Você atingiu o limite de 6 documentos.",
													{ autoClose: 3000 }
												);
												return;
											}

											setSelectedDocuments((prev) => [
												...prev,
												...filesArray,
											]);
										}}
										onError={(message) => {
											toast.error(message, {
												autoClose: 2000,
											});
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
													<p className="text-center">
														Arraste ou{" "}
														<Link
															onClick={() => {
																if (
																	!loading &&
																	selectedDocuments.length <
																		5
																) {
																	handleSelectDocument();
																} else {
																	toast.error(
																		"Você atingiu o limite de 6 documentos.",
																		{
																			autoClose: 3000,
																		}
																	);
																}
															}}
															className="text-foreground"
														>
															<b>clique aqui</b>
														</Link>{" "}
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
													className="default-border relative rounded-large w-full flex p-3 justify-between flex items-center"
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
