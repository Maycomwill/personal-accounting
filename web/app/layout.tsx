import type { Metadata } from "next";
import { Montserrat, Intel_One_Mono, Rubik_Mono_One } from "next/font/google";
import "./globals.css";
import AppProvider from "@/hooks";

const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});

const intelMono = Intel_One_Mono({
  variable: "--font-intel-one-mono",
  subsets: ["latin"],
});

const rubikMonoOne = Rubik_Mono_One({
  variable: "--font-rubik-mono-one",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Accounting",
  description: "Created by Maycom Willlams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserratSans.variable} ${rubikMonoOne.variable} ${intelMono.variable} antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
