import NoPosts from "@/components/card/NoPosts";

export default function HomeManageGroup() {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<NoPosts message="Escolha uma categoria para ver suas opções." />
		</div>
	);
}
