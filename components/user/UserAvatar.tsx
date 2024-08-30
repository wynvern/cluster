import Image from "next/image";

export default function UserAvatar({
	avatarURL,
}: {
	avatarURL?: string | null;
}) {
	return (
		<Image
			src={
				avatarURL
					? `${avatarURL}?size=100`
					: "/brand/default-avatar.svg"
			}
			className="h-10 w-10 sm:w-12 sm:h-12 rounded-large"
			alt="user-image"
			width={500}
			height={500}
		/>
	);
}
