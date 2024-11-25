"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { Button, Input, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import words from "../../../public/nameGenerator.json";
import AuthModalWrapper from "@/components/auth/AuthModalWrapper";
import completeProfile from "@/lib/db/user/userUtils";

export default function Finish() {
   const { update } = useSession();
   const router = useRouter();
   const [inputValidation, setInputValidation] = useState({
      message: "",
      active: false,
   });
   const [isLoading, setIsLoading] = useState(false);
   const session = useSession();
   const [success, setSuccess] = useState(false);
   const [username, setUsername] = useState("");

   useEffect(() => {
      // TODO: Chech if this is going to work
      if (session.data?.user.username) {
         router.push("/");
      }
   }, [session, router]);

   async function assignRandomUsername() {
      const word1 =
         words.adjectives[Math.floor(Math.random() * words.adjectives.length)];
      const word2 =
         words.subjects[Math.floor(Math.random() * words.subjects.length)];
      const generatedUsername = `${word1}.${word2}`;

      setUsername(generatedUsername);
   }

   async function handleComplete(e: React.FormEvent<HTMLFormElement>) {
      setIsLoading(true);
      e.preventDefault();

      if (!username) {
         setInputValidation({
            active: true,
            message: "Digite um nome de usuário",
         });
         setIsLoading(false);
         return false;
      }

      const data = await completeProfile(username);

      switch (data) {
         case "no-session":
            setInputValidation({
               active: true,
               message: "Sessão inválida",
            });
            setIsLoading(false);

            return false;
         case "invalid-username":
            setInputValidation({
               active: true,
               message: "Nome de usuário inválido",
            });
            setIsLoading(false);

            return false;
         case "username-in-use":
            setInputValidation({
               active: true,
               message: "Nome de usuário em uso",
            });
            setIsLoading(false);

            return false;
      }

      setIsLoading(false);
      setSuccess(true);
      update({ username: data });
   }

   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      if (session.data?.user.username) {
         router.push("/");
      }
   }, [session]);

   return (
      <AuthModalWrapper
         title="Complete seu perfil"
         subtitle="Escolha um nome de usuário que será exibido para outros usuários. Esse nome não poderá ser alterado."
      >
         <form className="gap-y-6 flex flex-col" onSubmit={handleComplete}>
            <Input
               placeholder="Nome de usuário"
               type="text"
               name="username"
               variant="bordered"
               isInvalid={inputValidation.active}
               errorMessage={inputValidation.message}
               value={username}
               isDisabled={isLoading || success}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value.length >= 20) {
                     setInputValidation({
                        active: true,
                        message:
                           "O nome de usuário pode ter somente até 20 caracteres.",
                     });
                     return false;
                  }
                  setUsername(e.target.value);
               }}
               startContent={
                  <>
                     <UserIcon className="h-6 text-neutral-500" />
                  </>
               }
               onValueChange={() => {
                  setInputValidation({
                     active: false,
                     message: "",
                  });
               }}
            />

            <div className="flex items-center justify-between">
               <div>
                  <Link
                     onClick={() => {
                        !success && !isLoading && assignRandomUsername();
                     }}
                  >
                     Nome aleatório
                  </Link>
               </div>
               <Button
                  type="submit"
                  color={success ? "success" : "primary"}
                  isLoading={isLoading}
                  isDisabled={isLoading || success}
                  startContent={
                     <>
                        {isLoading ? (
                           ""
                        ) : success ? (
                           <CheckIcon className="h-6" />
                        ) : (
                           <CheckIcon className="h-6" />
                        )}
                     </>
                  }
               >
                  Confirmar
               </Button>
            </div>
         </form>
      </AuthModalWrapper>
   );
}
