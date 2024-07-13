import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider as Auth0Provider } from "@auth0/nextjs-auth0/client";

import "./globals.scss";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evermyth",
  description: "Tools for running and playing the Evermyth tabletop RPG",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Auth0Provider>{children}</Auth0Provider>
      </body>
    </html>
  );
}
