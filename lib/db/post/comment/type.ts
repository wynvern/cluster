export default interface RecursiveComments {
	children?: RecursiveComments[];
	id: string;
	text: string;
	authorId: string;
	postId: string | null;
	createdAt: Date;
	parentId: string | null;
	media: string[];
	document: string[];
	author: {
		id: string;
		image: string | null;
		username: string | null;
		name: string | null;
	};
	deleted: boolean;
}
