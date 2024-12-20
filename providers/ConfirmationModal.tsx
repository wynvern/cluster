import { Button } from "@nextui-org/react";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import BaseModal from "@/components/modal/BaseModal";

function ConfirmationModal({
	title,
	description,
	onConfirm,
	onCancel,
	opened,
	isDanger,
}: {
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel: () => void;
	opened: boolean;
	isDanger?: boolean;
}) {
	return (
		<BaseModal
			active={opened}
			setActive={onCancel}
			title={title}
			body={description}
			footer={
				<>
					<Button
						onClick={onCancel}
						variant="bordered"
						startContent={<XMarkIcon className="h-6" />}
					>
						Cancelar
					</Button>
					<Button
						onClick={onConfirm}
						color={!isDanger ? "primary" : "danger"}
						startContent={<CheckIcon className="h-6" />}
					>
						Confirmar
					</Button>
				</>
			}
		/>
	);
}

interface ConfirmationModalProps {
	title: string;
	description: string;
	isDanger?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmationModalContext = createContext<
	| {
			confirm: (props: ConfirmationModalProps) => Promise<boolean>;
	  }
	| undefined
>(undefined);

export function ConfirmationModalProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [modalProps, setModalProps] = useState<ConfirmationModalProps | null>(
		null
	);
	const [isModalOpen, setIsModalOpen] = useState(false); // New state variable

	const confirm = useCallback((props: ConfirmationModalProps) => {
		setIsModalOpen(true);
		return new Promise<boolean>((resolve) => {
			setModalProps({
				...props,
				onConfirm: () => {
					resolve(true);
					props.onConfirm();
					setIsModalOpen(false);
				},
				onCancel: () => {
					resolve(false);
					props.onCancel();
					setIsModalOpen(false);
				},
			});
		});
	}, []);

	return (
		<ConfirmationModalContext.Provider value={{ confirm }}>
			{children}
			{modalProps && (
				<ConfirmationModal {...modalProps} opened={isModalOpen} />
			)}
		</ConfirmationModalContext.Provider>
	);
}

export function useConfirmationModal() {
	const context = useContext(ConfirmationModalContext);
	if (!context) {
		throw new Error(
			"useConfirmationModal must be used within a ConfirmationModalProvider"
		);
	}
	return context;
}
