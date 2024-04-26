import type { User } from "@prisma/client";

export default function UserPage({ user }: { user: User | null }) {
	if (!user) return <h1>User not found</h1>;

	return <h1>{user.username}</h1>;
}
