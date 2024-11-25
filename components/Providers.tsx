"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ServiceWorkerHandler from "./service/ServiceWorkerHandler";
import { ConfirmationModalProvider } from "@/providers/ConfirmationModal";
import { ImageCarouselProvider } from "@/providers/ImageDisplay";
import { SocketProvider } from "@/providers/Socket";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
   return (
      <>
         <ThemeProvider attribute="class" defaultTheme="dark">
            <NextUIProvider locale="pt-BR">
               <SessionProvider>
                  <ConfirmationModalProvider>
                     <ImageCarouselProvider>
                        <SocketProvider>{children}</SocketProvider>
                     </ImageCarouselProvider>
                     <ServiceWorkerHandler />
                  </ConfirmationModalProvider>
               </SessionProvider>
            </NextUIProvider>
         </ThemeProvider>

         <ToastContainer
            stacked={true}
            newestOnTop={true}
            position="bottom-center"
            theme="dark"
            transition={Slide}
            limit={1}
         />
      </>
   );
}
