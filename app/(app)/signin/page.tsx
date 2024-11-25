"use client";

import {
   ArrowLeftEndOnRectangleIcon,
   CheckIcon,
   EnvelopeIcon,
   KeyIcon,
} from "@heroicons/react/24/outline";
import { Button, Image, Input, Link } from "@nextui-org/react";
import { type SignInResponse, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModalWrapper from "@/components/auth/AuthModalWrapper";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleLoginButton from "@/components/auth/GLoginButton";
import ErrorBox from "@/components/general/ErrorBox";
import LogoTitle from "@/components/general/LogoTitle";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

export default function Login() {
   const [loading, setLoading] = useState(false);
   const [inputEmailVal, setInputEmailVal] = useState({
      message: "",
      active: false,
   });
   const [generalError, setGeneralError] = useState("");
   const [success, setSuccess] = useState(false);
   const router = useRouter();
   const [inputPasswordVal, setInputPasswordVal] = useState({
      message: "",
      active: false,
   });
   const [progress, setProgress] = useState(0);
   const isSmallScreen = useMediaQuery({ maxWidth: 700 });
   const session = useSession();

   function validateForm(email: string, password: string, numberval: string) {
      const errors = {
         email: "",
         password: "",
      };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (numberval) {
         return false;
      }

      if (email === "") {
         errors.email = "Email não pode estar vazio.";
      } else if (!emailRegex.test(email)) {
         errors.email = "Email digitado é inválido.";
      }

      if (password === "") {
         errors.password = "Senha não pode estar vazia.";
      }

      setInputEmailVal({
         message: errors.email,
         active: errors.email !== "",
      });

      setInputPasswordVal({
         message: errors.password,
         active: errors.password !== "",
      });

      return errors.email !== "" || errors.password !== "";
   }

   async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);

      const formEmail: string = formData.get("email") as string;
      const formPassword: string = formData.get("password") as string;

      if (
         validateForm(
            formEmail,
            formPassword,
            formData.get("numberval") as string
         )
      ) {
         setLoading(false);
         return;
      }

      const signInResult: SignInResponse | undefined = await signIn(
         "credentials",
         {
            email: formEmail,
            password: formPassword,
            redirect: false,
         }
      );

      if (!signInResult) {
         return false;
      }

      switch (signInResult.error) {
         case "missing-data":
            setGeneralError("Dados faltando.");
            break;
         case "email-not-found":
            setInputEmailVal({
               message: "Email não encontrado.",
               active: true,
            });
            break;
         case "password-not-match":
            setInputPasswordVal({
               message: "Senha incorreta.",
               active: true,
            });
            break;
         case "different-sign-in-provider":
            toast.error("Você já está logado com outro provedor.", {
               autoClose: 3000,
            });
            break;
         default:
            setSuccess(true);
            break;
      }
      setLoading(false);
   }

   useEffect(() => {
      if (session.status === "authenticated") {
         window.location.reload();
      }
   }, [session])

   useEffect(() => {
      setTimeout(() => {
         setProgress(50);

         setTimeout(() => {
            setProgress(100);
         }, 1000);
      }, 1000);
   }, []);

   return (
      <>
         <div className={"w-dvw h-dvh flex justify-between absolute"}>
            <div className="grow h-full object-cover sidebar-border hidden sm:hidden relative md:block">
               <Image
                  src="/brand/background.jpg"
                  className="w-full h-full rounded-none object-cover"
                  removeWrapper={true}
               />
               <div className="absolute bottom-10 left-10 z-10">
                  <LogoTitle />
               </div>
            </div>
            <div className="h-full lg:min-w-[600px] md:min-w-[600px] grow">
               <AuthModalWrapper title="Entrar" hideLogo={!isSmallScreen}>
                  <form
                     className="gap-y-6 flex flex-col"
                     onSubmit={handleLogin}
                  >
                     <Input
                        placeholder="Email"
                        type="text"
                        name="email"
                        color="default"
                        variant="bordered"
                        startContent={
                           <EnvelopeIcon className="h-6 text-neutral-500" />
                        }
                        isInvalid={inputEmailVal.active}
                        errorMessage={inputEmailVal.message}
                        onValueChange={() => {
                           setInputEmailVal({
                              message: "",
                              active: false,
                           });
                           setGeneralError("");
                        }}
                     />
                     <PasswordInput
                        placeholder="Senha"
                        color="default"
                        variant="bordered"
                        name="password"
                        startContent={
                           <KeyIcon className="h-6 text-neutral-500" />
                        }
                        isInvalid={inputPasswordVal.active}
                        errorMessage={inputPasswordVal.message}
                        onValueChange={() => {
                           setInputPasswordVal({
                              message: "",
                              active: false,
                           });
                           setGeneralError("");
                        }}
                     />
                     <Input
                        name="numberval"
                        type="text"
                        placeholder="Número de Telefone"
                        className="absolute left-0 -top-40"
                     />

                     <ErrorBox
                        error={generalError}
                        isVisible={Boolean(generalError)}
                     />

                     <div>
                        <p>
                           <Link href="/reset-password">
                              Esqueceu sua senha?
                           </Link>
                        </p>
                     </div>

                     <div className="flex justify-between items-center">
                        <div>
                           <p className="text-center">
                              <Link href="/signup">
                                 Crie uma conta
                              </Link>
                           </p>
                        </div>

                        <Button
                           type="submit"
                           color={success ? "success" : "primary"}
                           isDisabled={loading || success}
                           isLoading={loading}
                           startContent={
                              loading ? (
                                 ""
                              ) : success ? (
                                 <CheckIcon className="h-6" />
                              ) : (
                                 <ArrowLeftEndOnRectangleIcon className="h-6" />
                              )
                           }
                        >
                           Entrar
                        </Button>
                     </div>
                  </form>
                  <div className="flex flex-col gap-y-6 items-center">
                     <p className="text-center">Ou</p>
                     <GoogleLoginButton />
                  </div>
               </AuthModalWrapper>
            </div>
         </div>
      </>
   );
}
