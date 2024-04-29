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
}
