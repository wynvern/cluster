import { Chip, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Link from "next/link";
import UserAvatar from "../user/UserAvatar";
import type RecursiveComments from "@/lib/db/post/comment/type";
import {
   ChatBubbleBottomCenterIcon,
   DocumentIcon,
   EllipsisHorizontalIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import PrettyDate from "../general/PrettyDate";
import { useImageCarousel } from "@/providers/ImageDisplay";
import MediaDisplayPost from "../post/MediaDisplayPost";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useConfirmationModal } from "@/providers/ConfirmationModal";
import { deleteComment } from "@/lib/db/post/comment/comment";

interface commentCommentProps {
   comment: RecursiveComments;
   setReplyActive: (active: boolean) => void;
}

export default function ({ comment, setReplyActive }: commentCommentProps) {
   const { openCarousel } = useImageCarousel();
   const [mediaIndex, setMediaIndex] = useState(0);
   const session = useSession();
   const { confirm } = useConfirmationModal();

   async function handleDeleteComment() {
      // Delete
      await confirm({
         title: "Excluír comentário",
         description: "Tem certeza que deseja excluír esse comentário? Os comentários filhos não serão excluidos.",
         onCancel: () => { },
         onConfirm: async () => {
            const res = await deleteComment(comment.id);

            if (res === "ok") {
               // Reload
               window.location.reload();
            }
         },
      })
   }

   return (
      <div className="w-full flex flex-col">
         <div className="w-full justify-between flex items-start">
            {/* Author */}
            <div className="flex gap-x-4 items-start">
               <Link href={`/user/${comment.author.username}`}>
                  <UserAvatar size="10" avatarURL={!comment.deleted ? comment.author.image : "/brand/default-avatar.svg"} />
               </Link>
               <div className="flex flex-col">
                  <div className="flex items-center gap-x-2">
                     <b>
                        {!comment.deleted && <Link href={`/user/${comment.author.username}`}>
                           {comment.author.username}
                        </Link>}
                     </b>
                     <PrettyDate date={comment.createdAt} />
                  </div>
               </div>
            </div>

            <div className="flex gap-x-4">
               <Button
                  isDisabled={comment.deleted}
                  isIconOnly={true}
                  onClick={() => setReplyActive(true)}
                  variant="bordered"
                  size="sm"
                  className="p-1"
               >
                  <ChatBubbleBottomCenterIcon className="h-6" />
               </Button>
               {/* @ts-ignore */}
               <Dropdown backdrop="blur" isDisabled={comment.deleted}>
                  <DropdownTrigger>
                     <Button isIconOnly={true} variant="bordered" size="sm" className="p-1">
                        <EllipsisHorizontalIcon className="h-6" />
                     </Button>
                  </DropdownTrigger>
                  { /* @ts-ignore */}
                  <DropdownMenu>
                     {session.data?.user.id === comment.authorId && <DropdownItem onClick={handleDeleteComment} className="text-danger" startContent={<TrashIcon className="h-6 text-danger" />} description="Exclua seu comentário.">
                        Excluír
                     </DropdownItem>}
                  </DropdownMenu>
               </Dropdown>
            </div>
         </div>
         <div className="ml-14">
            <p className={!comment.deleted ? "break-all" : "break-all text-muted-foreground"}>{comment.deleted ? "(Comentário Excluído)" : comment.text}</p>
         </div>
         <div className="ml-16 flex flex-col">
            {/* Document */}
            {comment.document && comment.document.length > 0 ? (
               <div className="flex gap-x-2">
                  {comment.document.map((doc, index) => {
                     const docName = new URL(doc).pathname.split("/").pop();
                     if (!docName) return null;
                     const docNameWithoutSuffix = docName
                        .split("-")
                        .slice(0, -1)
                        .join("-");
                     return (
                        <Link key={doc} href={doc}>
                           <Chip>
                              <div className="flex gap-x-2">
                                 <DocumentIcon className="h-5 w-5" />
                                 <p>{docNameWithoutSuffix}</p>
                              </div>
                           </Chip>
                        </Link>
                     );
                  })}
               </div>
            ) : (
               ""
            )}
            {/* Image */}
            {comment.media && comment.media.length > 0 ? (
               <Link
                  href={""}
                  className="mt-4"
                  onClick={() => {
                     openCarousel(comment.media, mediaIndex);
                  }}
               >
                  <MediaDisplayPost
                     setIndex={(i) => setMediaIndex(i)}
                     media={comment.media}
                     index={mediaIndex}
                  />
               </Link>
            ) : (
               ""
            )}
         </div>
      </div>
   );
}
