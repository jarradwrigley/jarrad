"use client";

import { ReactNode } from "react";
import Header from "./Header";

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Header />
        {children}
      </div>
    </>


  );
}
