"use client";

import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function GoogleLoginButton() {
	const [loadingGoogle, setLoadingGoogle] = useState(false);

	async function signInGoogle() {
		const result = await signIn("google", { callbackUrl: "/" });
		console.log(result);
	}

	return (
		<Button
			onClick={() => {
				setLoadingGoogle(true);
				signInGoogle();
			}}
			className="max-w-fit"
			variant="bordered"
			isLoading={loadingGoogle}
			startContent={
				loadingGoogle ? (
					""
				) : (
					<Image
						width="20"
						height="20"
						className="invert-image"
						src="/external/google-logo.png"
						alt="logo-google"
					/>
				)
			}
		>
			Entrar com o Google
		</Button>
	);
}
