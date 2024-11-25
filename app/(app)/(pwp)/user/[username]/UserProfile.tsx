"use client";

import type User from "@/lib/db/user/type";
import { Image } from "@nextui-org/react";
import UserActions from "./UserActions";
// @ts-ignore
import { Image as NextImage } from "next/image";
import { useImageCarousel } from "@/providers/ImageDisplay";

interface UserProfileProps {
   user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
   const { openCarousel } = useImageCarousel();

   return (
      <div className="w-full">
         {/* Banner */}
         <div
            className={`w-full relative ${user ? "bg-neutral-800" : ""}`}
            style={{ aspectRatio: "1000 / 400" }}
         >
            <Image
               onClick={() => {
                  if (user?.banner) openCarousel([user.banner]);
               }}
               as={NextImage}
               removeWrapper={true}
               src={user ? `${user.banner as string}?size=550` : ""}
               className="rounded-none w-full object-cover"
               style={{ aspectRatio: "1000 / 400" }}
            />
            <div className="absolute -bottom-20 left-4 sm:left-10 bg-neutral-800 rounded-large">
               <Image
                  onClick={() => {
                     if (user?.image) openCarousel([user.image]);
                  }}
                  as={NextImage}
                  removeWrapper={true}
                  src={
                     user?.image
                        ? `${user.image.replace("sc96", "sc400")}?size=400`
                        : "/brand/default-avatar.svg"
                  }
                  className="h-[100px] sm:h-60 object-cover aspect-square"
               />
            </div>
         </div>

         {/* Information */}
         <div className="w-full px-4 sm:px-10 flex flex-col gap-y-2 sm:gap-y-4">
            <div className="w-full h-20 flex items-center justify-end">
               <UserActions user={user} />
            </div>
            <div>
               <h1 style={{ lineHeight: "40px" }}>{user.name}</h1>
               <h3 className="second-foreground">
                  <b>u/</b>
                  {user.username}
               </h3>
            </div>
            {user.bio && <p>{user.bio}</p>}
            <div className="flex gap-x-2">
               <p>
                  Posts <b>{user._count.posts}</b>
               </p>
               <p>
                  Salvos <b>{user._count.bookmarks}</b>
               </p>
               <p>
                  Grupos <b>{user._count.groups}</b>
               </p>
            </div>
         </div>
      </div>
   );
}
