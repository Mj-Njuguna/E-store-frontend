import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import NavbarServer from "@/components/navbar-server";
import Footer from "@/components/footer";
import AuthCheck from "@/components/auth-check";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
  description: "Store - The place for all your purchases.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <AuthCheck />
          <NavbarServer />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
