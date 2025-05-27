"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Header />
        {children}
        <Footer />
      </div>
    </>


  );
}
