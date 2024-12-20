import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";
import type { ReactNode } from "react";

export default function BaseModal({
	active,
	setActive,
	title,
	body,
	footer,
	size,
	extraProps,
}: {
	active: boolean;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	title: ReactNode;
	body: ReactNode;
	footer?: ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	extraProps?: any;
}) {
	return (
		<Modal
			size={size || "sm"}
			isOpen={active}
			backdrop="blur"
			className="text-foreground py-2 sm:py-4 default-border px-3 sm:px-6"
			placement="center"
			motionProps={{
				variants: {
					enter: {
						opacity: 1,
						transition: {
							duration: 0.2,
							ease: "easeOut",
						},
					},
					exit: {
						opacity: 0,
						transition: {
							duration: 0.2,
							ease: "easeIn",
						},
					},
				},
			}}
			onOpenChange={() => {
				setActive(false);
			}}
			{...extraProps}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="px-2">
							<h2>{title}</h2>
						</ModalHeader>
						<ModalBody className="px-0">{body}</ModalBody>
						{footer && (
							<ModalFooter className="px-0">{footer}</ModalFooter>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
