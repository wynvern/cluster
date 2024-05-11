import { Image, avatar } from "@nextui-org/react";

export default function UserAvatar({
	avatarURL,
}: {
	avatarURL?: string | null;
}) {
	return (
		<Image
			src={avatarURL || "/brand/default-avatar.svg"}
			removeWrapper={true}
			className="h-10 sm:h-12 border-default"
		/>
	);
}
