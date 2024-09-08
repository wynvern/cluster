import type { Metadata } from "next";
import "../../style/global.css";
import Providers from "@/components/Providers";

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
		<html lang="pt-BR" className="dark">
			<head>
				<meta httpEquiv="Cache-Control" content="public" />
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export const fetchCache = "force-no-store";
