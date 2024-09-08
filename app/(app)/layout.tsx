import type { Metadata } from "next";
import "../../style/global.css";
import Providers from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
	title: "Cluster",
	description: "Cluster para estudantes",
	generator: "Next.js",
	manifest: "/manifest.json",
	authors: [
		{ name: "wynvern" },
		{
			name: "wynvern",
			url: "https://www.github.com/wynvern",
		},
	],
	icons: [
		{ rel: "apple-touch-icon", url: "/brand/icon-512x512.png" },
		{ rel: "icon", url: "/brand/icon-512x512.png" },
	],
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<head>
				<meta http-equiv="cache-control" content="" />
			</head>
			<body>
				<SpeedInsights />
				<Analytics />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
