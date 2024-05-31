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
		document: true,
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
