import { CircularProgress } from "@nextui-org/react";
import { type ReactNode, useEffect, useState } from "react";

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
	const take = Number.parseInt(
		process.env.NEXT_PUBLIC_BATCH_FETCH_SIZE || "40",
	); // Sets the amount to take globally

	useEffect(() => {
		const handleScroll = () => {
			if (noMoreData || loading) return;

			const scrollTop = document.documentElement.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight;
			const clientHeight = document.documentElement.clientHeight;

			if (scrollTop + clientHeight >= scrollHeight - 5) {
				setSkip((prevSkip) => prevSkip + take);
				onBottomReached(skip + take, take);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [loading, noMoreData, skip, take, onBottomReached]);

	return (
		<>
			{children}
			{loading && (
				<div className="w-full flex items-center justify-center h-40">
					<CircularProgress />
				</div>
			)}
		</>
	);
}
