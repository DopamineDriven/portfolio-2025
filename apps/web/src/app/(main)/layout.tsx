import React from "react";
import { Footer } from "@/ui/footer";
import { default as Navbar } from "@/ui/nav/temp";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[96rem] flex-col overflow-x-hidden! sm:px-6 lg:px-8">
      <Navbar />
      <main className="theme-transition min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
