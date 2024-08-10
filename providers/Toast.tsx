import {
	createContext,
	type ReactNode,
	useContext,
	useState,
	useEffect,
} from "react";

interface ToastContextType {
	showToast: (content: string | ReactNode) => void;
}

const ToastDisplayContext = createContext<ToastContextType | undefined>(
	undefined
);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ReactNode[]>([]);

	const showToast = (content: string | ReactNode) => {
		setToasts((prevToasts) => [...prevToasts, content]);
	};

	useEffect(() => {
		if (toasts.length > 0) {
			const timer = setTimeout(() => {
				setToasts((prevToasts) => prevToasts.slice(1));
			}, 10000); // 10 seconds

			return () => clearTimeout(timer);
		}
	}, [toasts]);

	return (
		<ToastDisplayContext.Provider value={{ showToast }}>
			{children}
			<div style={{ position: "absolute", bottom: 0, right: 0 }}>
				{toasts.map((toast, index) => (
					<div key={index}>
						{typeof toast === "string" ? (
							<span>showing something</span>
						) : (
							toast
						)}
					</div>
				))}
			</div>
		</ToastDisplayContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastDisplayContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
