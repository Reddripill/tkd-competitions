import { Roboto } from "next/font/google";
import AppChakraProvider from "@/providers/ChakraProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
   title: "Расписание соревнование ТКД по тхэквондо",
   description: "Расписание соревнование ТКД по тхэквондо",
};

const roboto = Roboto({
   subsets: ["cyrillic"],
});

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="ru" suppressHydrationWarning>
         <body className={roboto.className}>
            <AppChakraProvider>{children}</AppChakraProvider>
         </body>
      </html>
   );
}
