export default interface Post {
	id: string;
	title: string;
	content: string;
	group: {
		id: string;
		groupname: string;
		image: string | null;
	};
	groupId: string;
	authorId: string;
	author: {
		id: string;
		username: string | null;
		image: string | null;
	};
	media: string[];
	document?: string[];
	pinned: boolean;
	bookmarks: {
		id: string;
		userId: string;
		postId: string;
		createdAt: Date;
	}[];
	createdAt: Date;
}
5;
