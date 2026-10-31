import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInit } from "@/components/layout/ThemeInit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Além das Barreiras: Capacitismo no Ambiente de Trabalho",
  description: "Atividades de rotina profissional — Além das Barreiras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark:bg-black`}
    >
      <body className="flex min-h-full flex-col bg-neutral-100 font-sans text-neutral-900 dark:bg-black dark:text-neutral-100">
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
