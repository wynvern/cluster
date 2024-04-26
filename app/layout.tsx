import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../style/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Cluster",
	description: "Cluster para estudantes",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
