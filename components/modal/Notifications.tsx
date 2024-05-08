import { useState } from "react";
import BaseModal from "./BaseModal";
import { ScrollShadow, CircularProgress, Link, Image } from "@nextui-org/react";
import { getNotifications } from "@/lib/db/user/user";

interface NotificationsProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Notifications({
	isActive,
	setIsActive,
}: NotificationsProps) {
	const [notifications, setNotifications] = useState<
		{
			id: string;
			title: string;
			body: string | null;
			image: string | null;
			link: string | null;
			viewed: boolean;
			createdAt: Date;
			userId: string;
		}[]
	>([]);
	async function fetchNotifications() {
		const response = await getNotifications();
		setNotifications(response);
	}

	return (
		<BaseModal
			title="Notificações"
			active={isActive}
			setActive={setIsActive}
			size="xl"
			body={
				<ScrollShadow
					className="oveflow-y-scroll"
					orientation="vertical"
				>
					<>
						<h3 className="">Novas</h3>
						<div className="flex flex-col gap-y-3 mt-2">
							{notifications
								.filter((i) => !i.viewed)
								.map((i) => (
									<div
										key={i.id}
										className={`bg-default-100 p-3 rounded-large ${
											i.viewed ? "opacity-[50%]" : ""
										}`}
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
						<h3 className="mt-4">Antigas</h3>
						<div className="flex flex-col gap-y-3 mt-2">
							{notifications
								.filter((i) => i.viewed)
								.map((i) => (
									<div
										key={i.id}
										className={`bg-default-100 p-3 rounded-large ${
											i.viewed ? "opacity-[50%]" : ""
										}`}
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
					</>
				</ScrollShadow>
			}
		/>
	);
}
