import BaseModal from "./BaseModal";
import { ScrollShadow, Image } from "@nextui-org/react";
import InfoMessage from "../card/InfoMessage";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import PrettyDate from "../general/PrettyDate";

interface NotificationsProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	notifications: Notification[];
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
	notifications,
	setIsActive,
}: NotificationsProps) {
	const { confirm } = useConfirmationModal();

	return (
		<BaseModal
			title="Notificações"
			active={isActive}
			setActive={setIsActive}
			size="xl"
			body={
				<ScrollShadow
					className={"oveflow-y-scroll max-h-[70vh] min-h-[50vh]"}
					// @ts-ignore
					orientation="vertical"
				>
					{notifications.length === 0 && (
						<div className="w-full h-full flex items-center justify-center my-10">
							<InfoMessage message="Nenhuma notificação." />
						</div>
					)}

					<div className="flex flex-col gap-y-3 mt-2">
						{notifications.reverse().map((n) => (
							<div
								key={n.id}
								className={`relative flex justify-center gap-x-2 items-center ${n.viewed ? "opacity-50" : ""}`}
							>
								<div>
									<Image
										src={n.image}
										removeWrapper={true}
										className="w-10 h-10"
									/>
								</div>
								<div>
									<div className="flex items-center gap-x-1">
										<b>{n.title}</b>
										<PrettyDate date={new Date(n.createdAt)} />
									</div>
									<div>
										<p>{n.body}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</ScrollShadow>
			}
		/>
	);
}
