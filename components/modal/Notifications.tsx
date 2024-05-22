import { use, useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { ScrollShadow, CircularProgress, Link, Image } from "@nextui-org/react";
import { getNotifications } from "@/lib/db/user/user";

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

	async function fetchNotifications() {
		setLoading(true);
		const response = await getNotifications();

		const groupedNotifications = response.reduce(
			(groups: { [key: string]: any[] }, notification) => {
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

	useEffect(() => {
		if (isActive) fetchNotifications();
	}, [isActive]);

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
												className={`bg-neutral-800 p-3 rounded-large ${
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
													<Image
														src={i.image || ""}
														className="h-10 w-10 rounded-full"
														removeWrapper={true}
													/>
													<div className="flex flex-col">
														<div className="flex items-center gap-x-1">
															<h3 className="font-bold">
																{i.title}
															</h3>
															<p className="text-foreground">
																•
															</p>
															<p>
																{new Date(
																	i.createdAt
																).toLocaleString()}
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
		/>
	);
}
