/* eslint-disable @next/next/no-img-element */

import "~/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "RamGPT - Inspired by MemGPT",
  description: "A JS/TS implementation and UI inspired by MemGPT",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en h-full">
      <body className={`h-full font-sans ${inter.variable}`}>{children}</body>
    </html>
  );
}
