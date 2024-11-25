import Image from "next/image";

export default function UserAvatar({
   avatarURL,
   size = "10",
}: {
   avatarURL?: string | null;
   size?: string;
}) {
   return (
      <Image
         src={avatarURL ? `${avatarURL.replace("sc96", "sc400")}` : "/brand/default-avatar.svg"}
         className={`h-${size} w-${size} sm:w-$ sm:h-${size} rounded-large`}
         alt="user-image"
         width={500}
         height={500}
      />
   );
}
