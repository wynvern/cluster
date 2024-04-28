import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import BaseModal from "./BaseModal";

interface SignOutProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignOut({ isActive, setIsActive }: SignOutProps) {
	const [loading, setLoading] = useState(false);
	async function handleSignOut() {
		setLoading(true);
		signOut();
	}

	return (
		<BaseModal
			title="Sair"
			active={isActive}
			setActive={setIsActive}
			body="Ao sair, você perderá o acesso temporário e será necessário efetuar o login novamente."
			footer={
				<Button
					color="danger"
					onClick={handleSignOut}
					style={{ lineHeight: "1.5" }}
					isLoading={loading}
					startContent={
						loading ? (
							""
						) : (
							<ArrowLeftStartOnRectangleIcon className="h-6" />
						)
					}
				>
					Sair
				</Button>
			}
		/>
	);
}
