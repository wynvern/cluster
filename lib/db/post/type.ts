export default interface Post {
	id: string;
	title: string;
	content: string;
	group: {
		id: string;
		groupname: string;
		image: string;
	};
	groupId: string;
	authorId: string;
	author: {
		id: string;
		username: string;
		image: string;
	};
	media?: string[];
	document?: string[];
	pinned: boolean;
}
