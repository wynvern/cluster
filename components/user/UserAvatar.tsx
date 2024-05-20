import Image from "next/image";

export default function UserAvatar({
	avatarURL,
}: {
	avatarURL?: string | null;
}) {
	return (
		<Image
			src={avatarURL || "/brand/default-avatar.svg"}
			className="h-10 w-10 sm:w-12 sm:h-12 rounded-large"
			alt="user-image"
			width={40}
			height={40}
			loading="lazy"
		/>
	);
}
