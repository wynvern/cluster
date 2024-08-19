import BaseModal from "@/components/modal/BaseModal";

export default function CropImage({
	image,
	onCrop,
	aspectRatio,
	active,
	setActive,
}: {
	image: string;
	onCrop: any;
	aspectRatio: number;
	active: boolean;
	setActive: any;
}) {
	return (
		<BaseModal
			active={true}
			title={"Cortar imagem"}
			setActive={setActive}
			body={<div>hello</div>}
		/>
	);
}
