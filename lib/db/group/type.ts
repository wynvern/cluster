interface GroupCount {
	posts: number;
	members: number;
}

export default interface Group {
	id: string;
	name: string | null;
	categories: string[];
	image: string | null;
	banner: string | null;
	groupname: string;
	description: string | null;
	_count: GroupCount;
	GroupChat: {
		id: string;
	} | null;
	createdAt: Date;
	isUserMember?: boolean;
}

export interface UserGroupInfo {
	id: string;
	name: string | null;
	groupname: string;
	description: string | null;
	categories: string[];
	image: string | null;
	banner: string | null;
	createdAt: Date;
	guidelines: string | null;
	GroupChat?: {
		id: string;
	};
}
[];

export interface GroupCard {
	id: string;
	name: string | null;
	groupname: string;
	image: string | null;
	banner: string | null;
}
[];

export interface GroupSettings {
	id: string;
	groupId: string;
	memberPosting: boolean;
	memberJoining: boolean;
	chatEnabled: boolean;
	createdAt: Date;
}

export interface UserGroupChats {
	id: string;
	name: string | null;
	groupname: string;
	image: string | null;
	GroupChat: {
		id: string;
		messages: {
			user: {
				username: string | null;
			};
			createdAt: Date;
			content: string;
		}[];
	} | null;
}

export class MessageProps {
	content: string;
	userId: string;
	user: {
		id: string;
		username: string | null;
		image: string | null;
	};
	chatId: string;
	media: string[];
	replyToId: string;
	createdAt: Date;
	chat: {
		group: {
			groupname: string;
		};
	};

	constructor(
		content: string,
		userId: string,
		user: {
			id: string;
			username: string | null;
			image: string | null;
		},
		chatId: string,
		media: string[],
		replyToId: string,
		createdAt: Date,
		chat: {
			group: {
				groupname: string;
			};
		}
	) {
		this.content = content;
		this.userId = userId;
		this.user = user;
		this.chatId = chatId;
		this.media = media;
		this.replyToId = replyToId;
		this.createdAt = createdAt;
		this.chat = chat;
	}
}

export interface BannedMember {
	user: {
		id: string;
		name: string | null;
		image: string | null;
		username: string | null;
	};
	bannedAt: Date;
	reason: string | null;
}
