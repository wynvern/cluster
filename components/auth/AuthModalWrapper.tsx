import LogoTitle from "../sign/LogoTitle";

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
		<div className="flex w-full h-dvh items-center justify-center flex-col">
			<div className="default-border m-4 flex flex-col gap-y-6 w-full max-w-[500px] px-8 py-8 sm:p-16  rounded-large">
				<LogoTitle />
				<div>
					<h2>{title}</h2>
					{subtitle && <p>{subtitle}</p>}
				</div>
				{children}
			</div>
			<p className="text-default-200 mt-2">
				Cluster sobre licença Apache 2.0
			</p>
		</div>
	);
}
