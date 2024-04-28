interface Count {
	posts: number;
	bookmarks: number;
	groups: number;
}

export default interface User {
	id: string;
	name: string | null;
	username: string | null;
	bio: string | null;
	image: string | null;
	banner: string | null;
	_count: Count;
}
