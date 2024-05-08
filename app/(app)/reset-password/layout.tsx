import { type ReactNode, Suspense } from "react";

export default function ResetPasswordLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <Suspense>{children}</Suspense>;
}
