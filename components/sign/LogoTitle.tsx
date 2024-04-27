import Image from "next/image";

export default function LogoTitle() {
	return (
		<div className="flex w-full justify-center items-center gap-x-4 mb-6">
			<Image
				width="100"
				height="100"
				src="/brand/logo.svg"
				className="h-20 inverted-image"
				alt="logo"
			/>
			<h1>Cluster</h1>
		</div>
	);
}
