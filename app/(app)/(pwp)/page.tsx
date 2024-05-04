"use client";

import { sendNotification } from "@/lib/notification";
import { useSession } from "next-auth/react";

export default function HomePage() {
	const session = useSession();

	return (
		<div>
			<button
				type="button"
				onClick={() => {
					sendNotification({
						receiverUserId: session.data?.user.id || "",
						message: {
							title: "mensagem teste",
							body: "corpo da mensagem",
						},
					});
				}}
			>
				CLICAR
			</button>
		</div>
	);
}
