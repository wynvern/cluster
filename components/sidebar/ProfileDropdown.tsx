"use client";

import {
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
   Link,
} from "@nextui-org/react";
import { useState } from "react";
import SignOut from "../modal/SignOut";
import {
   ArrowLeftEndOnRectangleIcon,
   ChevronUpDownIcon,
   Cog6ToothIcon,
   UserIcon,
} from "@heroicons/react/24/outline";
import UserAvatar from "../user/UserAvatar";

export default function ProfileDropdown({
   onClick,
   userData,
}: {
   onClick?: () => void;
   userData: any;
}) {
   const [signOutModal, setSignOutModal] = useState(false);

   return (
      <>
         <div className="">
            <Dropdown
               // @ts-ignore
               backdrop="blur"
               className="default-border shadow-none"
               // @ts-ignore
               placement="top"
            >
               <DropdownTrigger>
                  <div className="flex w-full justify-between items-center pr-4 transition-all duration-200">
                     <div className="flex gap-x-4 items-center">
                        <UserAvatar avatarURL={userData.image} />
                        <div className="flex flex-col">
                           <b className="sidebar-inside min-w-[200px]">
                              {userData.name}
                           </b>
                           <p className="second-foreground sidebar-inside">
                              u/{userData.username}
                           </p>
                        </div>
                     </div>
                     <Link className="sidebar-inside">
                        <ChevronUpDownIcon className="h-6 z-10" />
                     </Link>
                  </div>
               </DropdownTrigger>
               {/* @ts-ignore */}
               <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                     description="Veja seu perfil"
                     startContent={<UserIcon className="h-6" aria-label="Sign Out" />}
                     aria-label="View profile"
                     href={`/user/${userData.username}`}
                  >
                     Perfil
                  </DropdownItem>
                  <DropdownItem
                     description="Configure o aplicativo"
                     startContent={
                        <Cog6ToothIcon className="h-6" aria-label="Sign Out" />
                     }
                     href="/settings"
                     aria-label="View profile"
                  >
                     Configurações
                  </DropdownItem>
                  <DropdownItem
                     description="Desconecte-se de sua conta"
                     className="text-danger"
                     onClick={() => {
                        setSignOutModal(true);
                        if (onClick) onClick();
                     }}
                     startContent={
                        <ArrowLeftEndOnRectangleIcon
                           className="h-6"
                           aria-label="Sign Out"
                        />
                     }
                     aria-label="Sign Out"
                  >
                     Sair
                  </DropdownItem>
               </DropdownMenu>
            </Dropdown>
         </div>

         <SignOut setIsActive={setSignOutModal} isActive={signOutModal} />
      </>
   );
}
