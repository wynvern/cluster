import { use, useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import {
	ScrollShadow,
	CircularProgress,
	Link,
	Image,
	Button,
} from "@nextui-org/react";
import { cleanUserNotifications, getNotifications } from "@/lib/db/user/user";
import prettyDate from "@/util/prettyDate";
import { XMarkIcon } from "@heroicons/react/24/outline";
import NoPosts from "../card/NoPosts";
import { useConfirmationModal } from "@/providers/ConfirmationModal";

interface NotificationsProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

type Notification = {
	id: string;
	title: string;
	body: string | null;
	image: string | null;
	link: string | null;
	viewed: boolean;
	createdAt: Date;
	userId: string;
};

export default function Notifications({
	isActive,
	setIsActive,
}: NotificationsProps) {
	const [loading, setLoading] = useState(false);
	const [notifications, setNotifications] = useState<{
		[title: string]: Notification[];
	}>({});
	const { confirm } = useConfirmationModal();

	async function fetchNotifications() {
		setLoading(true);
		const response = await getNotifications();

		const groupedNotifications = response.reduce(
			(groups: { [key: string]: Notification[] }, notification) => {
				if (!groups[notification.title]) {
					groups[notification.title] = [];
				}
				groups[notification.title].push(notification);
				return groups;
			},
			{}
		);

		setNotifications(groupedNotifications);
		setLoading(false);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isActive) fetchNotifications();
	}, [isActive]);

	async function handleCleanNotifications() {
		await confirm({
			onConfirm: async () => {
				const response = await cleanUserNotifications();

				switch (response) {
					case "ok":
						fetchNotifications();
						break;
				}
			},
			title: "Limpar notificações",
			description:
				"Deseja limpar todas as notificações? Esta ação é irreversível.",
			onCancel: () => {},
			isDanger: true,
		});
	}

	return (
		<BaseModal
			title="Notificações"
			active={isActive}
			setActive={setIsActive}
			size="xl"
			body={
				<ScrollShadow
					className={`oveflow-y-scroll max-h-[70vh] min-h-[50vh] ${
						loading ? "flex items-center justify-center" : ""
					}`}
					orientation="vertical"
				>
					{Object.values(notifications).length === 0 && (
						<div className="w-full h-full flex items-center justify-center my-10">
							<NoPosts message="Nenhuma notificação." />
						</div>
					)}
					{loading ? (
						<CircularProgress />
					) : (
						<div className="flex flex-col gap-y-3 mt-2">
							{Object.entries(notifications).map(
								([title, group]) => (
									<div
										key={title}
										className="relative flex justify-center"
									>
										{group.map((i, index) => (
											<div
												key={i.id}
												className={`bg-neutral-800 p-3 w-full rounded-large ${
													i.viewed
														? "brightness-[70%]"
														: ""
												} ${index <= 1 ? "" : "hidden"}
                                    ${index === 0 ? "z-50" : ""}
                                    ${
										index === 1
											? "absolute top-12 z-0 scale-[95%]"
											: ""
									}
                                    `}
											>
												<Link
													className="text-foreground flex h-full w-full items-center gap-x-4"
													href={i.link || ""}
												>
													{i.image && (
														<Image
															src={i.image || ""}
															className="h-10 w-10 rounded-full"
															removeWrapper={true}
														/>
													)}
													<div className="flex flex-col">
														<div className="flex items-center gap-x-1">
															<p className="text-foreground">
																{`${
																	i.title
																} • ${prettyDate(
																	{
																		date: i.createdAt,
																	}
																)}`}
															</p>
														</div>
														<p>{i.body}</p>
													</div>
												</Link>
											</div>
										))}
									</div>
								)
							)}
						</div>
					)}
				</ScrollShadow>
			}
			footer={
				<Button
					isDisabled={Object.values(notifications).length === 0}
					isIconOnly={true}
					variant={"bordered"}
					onClick={handleCleanNotifications}
				>
					<XMarkIcon className="h-6" />
				</Button>
			}
		/>
	);
}
