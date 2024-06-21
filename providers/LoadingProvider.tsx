import { createContext, useContext, useState, type ReactNode } from "react";
import BaseModal from "@/components/modal/BaseModal";
import { CircularProgress } from "@nextui-org/react";

// Define a type for the context value to improve readability
type LoadingModalContextType = {
	loading: (isLoading: boolean) => void;
};

// Provide a default value matching the context type
const defaultLoadingModalContextValue: LoadingModalContextType = {
	loading: () => {}, // No-op function as a placeholder
};

const LoadingModalContext = createContext<LoadingModalContextType>(
	defaultLoadingModalContextValue
);

export function LoadingModalProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(false);

	const loading = (show: boolean) => {
		setIsLoading(show);
	};

	return (
		<LoadingModalContext.Provider value={{ loading }}>
			{children}
			{isLoading && (
				<BaseModal
					size="sm"
					active={true}
					setActive={() => setIsLoading(false)}
					title=""
					body={
						<div className="w-10 h-10 flex items-center justify-center">
							<CircularProgress size="lg" />
						</div>
					}
				/>
			)}
		</LoadingModalContext.Provider>
	);
}

export function useLoading() {
	const context = useContext(LoadingModalContext);
	// No need for a null-check here, as context will always have a value
	return context;
}
