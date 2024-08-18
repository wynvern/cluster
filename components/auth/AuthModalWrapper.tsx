import LogoTitle from "../general/LogoTitle";

interface AuthModalWrapperProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}

export default function AuthModalWrapper({
	title,
	subtitle = "",
	children,
}: AuthModalWrapperProps): JSX.Element {
	return (
		<div className=" flex w-full h-dvh items-center justify-center flex-col px-2 sm:px-4">
			<div className="m-4 flex flex-col gap-y-6 w-full max-w-[520px] px-6 py-4 sm:p-10">
				<LogoTitle />
				<div>
					<h2>{title}</h2>
					{subtitle && <p>{subtitle}</p>}
				</div>
				{children}
			</div>
			<p className="text-neutral-500 mt-2">
				Cluster sobre licença Apache 2.0 personalizada
			</p>
		</div>
	);
}
