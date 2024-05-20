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

		// Cleanup function
		return () => {
			if (bottomRef.current) {
				observer.unobserve(bottomRef.current);
			}
		};
	}, [loading, noMoreData, skip]); // Include skip in the dependency array

	useEffect(() => {
		if (loading) {
			window.scrollTo(0, document.body.scrollHeight);
		}
	}, [loading]);

	return (
		<>
			{children}
			{/* Div to check if needs to load more */}
			<div ref={bottomRef} />
			{loading && (
				<div className="w-full flex items-center justify-center my-6">
					<CircularProgress />
				</div>
			)}
		</>
	);
}
