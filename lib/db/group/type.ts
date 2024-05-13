interface GroupCount {
	posts: number;
	members: number;
}

export default interface Group {
	id: string;
	name: string | null;
	image: string | null;
	banner: string | null;
	groupname: string;
	description: string | null;
	_count: GroupCount;
	GroupChat: {
		id: string;
	} | null;
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
