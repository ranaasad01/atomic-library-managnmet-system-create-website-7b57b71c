"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, BookOpen, Users, ArrowRight, ArrowLeft, AlertCircle, Search, Settings, X } from 'lucide-react';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Layout },
  { href: "/books", label: "Books Catalog", icon: BookOpen },
  { href: "/members", label: "Members", icon: Users },
  { href: "/issue", label: "Issue Book", icon: ArrowRight },
  { href: "/return", label: "Return Book", icon: ArrowLeft },
  { href: "/overdue", label: "Overdue & Fines", icon: AlertCircle },
  { href: "/search", label: "Search", icon: Search },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const content = (
    <div className="flex flex-col h-full bg-[#1E3A5F] text-white">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F0A500] rounded-lg flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight">LibraryPro</p>
            <p className="text-xs text-white/50">Management System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={
              isActive(href)
                ? "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-[#F0A500] text-white shadow-md"
                : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
            }
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <Settings size={18} />
          Settings
        </Link>
        <div className="mt-4 px-3 py-3 bg-white/5 rounded-lg">
          <p className="text-xs text-white/50">Library Admin</p>
          <p className="text-sm font-semibold text-white">John Smith</p>
          <p className="text-xs text-[#F0A500]">Administrator</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-30 shadow-xl">
        {content}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative flex flex-col w-64 h-full shadow-xl z-10">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
