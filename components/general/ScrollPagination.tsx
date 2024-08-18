import { CircularProgress, Spinner } from "@nextui-org/react";
import { type ReactNode, useEffect, useState, useRef } from "react";

interface ScrollPaginationProps {
	onBottomReached: (skip: number, take: number) => void;
	children: ReactNode;
	noMoreData: boolean;
	loading: boolean;
}

export default function ScrollPagination({
	onBottomReached,
	children,
	loading,
	noMoreData,
}: ScrollPaginationProps) {
	const [skip, setSkip] = useState(0);
	const bottomRef = useRef<HTMLDivElement>(null);
	const take = 20; // Sets the amount to take globally

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleBottomReached = async () => {
			if (noMoreData || loading) return;

			setSkip((prevSkip) => prevSkip + take);
			onBottomReached(skip + take, take);
		};

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) handleBottomReached();
		});

		if (bottomRef.current) {
			observer.observe(bottomRef.current);
		}

		return () => {
			if (bottomRef.current) {
				observer.unobserve(bottomRef.current);
			}
		};
	}, [loading, noMoreData, skip]);

	return (
		<>
			{children}
			{/* Div to check if needs to load more */}
			<div ref={bottomRef} />
			{loading && (
				<div className="w-full flex items-center justify-center">
					<CircularProgress />
				</div>
			)}
		</>
	);
}
