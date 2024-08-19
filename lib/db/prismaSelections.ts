// Type: Prisma Selections for the post entity, used in the post cards and other client components.
export function postSelection(userId: string) {
	return {
		bookmarks: {
			where: {
				userId: userId,
			},
		},
		authorId: true,
		content: true,
		createdAt: true,
		PostDocument: true,
		approved: true,
		groupId: true,
		id: true,
		title: true,
		media: true,
		pinned: true,
		author: {
			select: {
				id: true,
				username: true,
				name: true,
				image: true,
				bio: true,
				groups: {
					select: {
						group: {
							select: {
								members: {
									select: {
										joinedAt: true,
									},
								},
							},
						},
					},
				},
			},
		},
		group: {
			select: {
				id: true,
				groupname: true,
				image: true,
			},
		},
	};
}

export function userSelection() {
	return {
		id: true,
		name: true,
		image: true,
		banner: true,
		username: true,
		bio: true,
		createdAt: true,
		_count: {
			select: {
				posts: true,
				bookmarks: true,
				groups: true,
			},
		},
		userSettings: {
			select: {
				privateProfile: true,
			},
		},
	};
}

export function groupSelection() {
	return {
		id: true,
		name: true,
		categories: true,
		image: true,
		banner: true,
		groupname: true,
		description: true,
		_count: true,
		GroupChat: {
			select: {
				id: true,
			},
		},
		createdAt: true,
	};
}
