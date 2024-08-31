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
		name: string | null;
		bio: string | null;
		groups: {
			group: {
				members: {
					joinedAt: Date;
				}[];
			};
		}[];
	};
	media: string[];
	PostDocument: {
		id: string;
		postId: string;
		name: string;
		url: string;
		type: string;
	}[];
	pinned: boolean;
	approved: boolean;
	bookmarks: {
		id: string;
		userId: string;
		postId: string;
		createdAt: Date;
	}[];
	createdAt: Date;
	comments: {
		author: {
			username: string | null;
			image: string | null;
		};
	}[];
	_count: {
		comments: number;
		bookmarks: number;
		postView: number;
	};
}
