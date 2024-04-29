"use client";

import type User from "@/lib/db/user/type";
import fetchUser from "@/lib/db/user/user";
import { useEffect, useState } from "react";
import UserDisplay from "./UserDisplay";
import TabContent from "./TabContent";

export default function UserPage({ params }: { params: { username: string } }) {
	const [notFound, setNotFound] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	async function handleFetchUser() {
		const data = await fetchUser({ username: params.username });

		if (!data) {
			setNotFound(true);
			return false;
		}

		setUser(data);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchUser();
	}, []);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="side-borders w-full max-w-[1000px] h-full">
				{notFound ? <>User was not found</> : ""}
				<UserDisplay user={user} />
				<TabContent />
			</div>
		</div>
	);
}
