interface ErrorBoxProps extends React.HTMLAttributes<HTMLDivElement> {
	error: string;
	isVisible: boolean;
}

export default function ErrorBox({
	error,
	isVisible,
	className,
}: ErrorBoxProps) {
	return (
		<>
			{isVisible && (
				<div
					className={`bg-red-950 text-danger px-4 py-3 rounded-large relative ${className}`}
					role="alert"
				>
					<p className="block sm:inline">{error}</p>
				</div>
			)}
		</>
	);
}
