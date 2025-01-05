import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toast as Toaster } from "@/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chess Game",
  description: "A chess game built with Next.js and React"
} satisfies Metadata;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
