import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../style/global.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={`${inter.className}`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
