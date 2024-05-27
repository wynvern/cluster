export interface MessageProps {
	id: string;
	content: string;
	userId: string;
	user: {
		id: string;
		username: string | null;
		image: string | null;
	};
	createdAt: Date;
	chatId: string;
	attachments?: string[];
	media?: string[];
}
