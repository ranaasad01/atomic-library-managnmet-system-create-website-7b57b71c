"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { getTransactions } from "@/lib/store";

interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

export default function AppShell({ title, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    const count = getTransactions().filter((t) => t.status === "overdue").length;
    setOverdueCount(count);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        overdueCount={overdueCount}
      />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
        <footer className="px-4 lg:px-8 py-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400 text-center">
            LibraryPro Management System &copy; {new Date().getFullYear()} &mdash; All rights reserved
          </p>
        </footer>
      </div>
    </div>
  );
}
