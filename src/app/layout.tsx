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
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <div className="flex min-h-full flex-col">
          <header className="shrink-0 border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="RamGPT"
              />
              <div className="flex items-center gap-x-8">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">View notifications</span>
                </button>
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your profile</span>
                  <div className="h-8 w-8 rounded-full bg-gray-800"></div>
                </a>
              </div>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
