"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, BookOpen, Users, ArrowRight, ArrowLeft, AlertCircle, Search, Settings, X, ChevronRight } from 'lucide-react';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Layout, badge: null },
  { href: "/books", label: "Books Catalog", icon: BookOpen, badge: null },
  { href: "/members", label: "Members", icon: Users, badge: null },
  { href: "/issue", label: "Issue Book", icon: ArrowRight, badge: null },
  { href: "/return", label: "Return Book", icon: ArrowLeft, badge: null },
  { href: "/overdue", label: "Overdue & Fines", icon: AlertCircle, badge: "!" },
  { href: "/search", label: "Search", icon: Search, badge: null },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  overdueCount?: number;
}

export default function Sidebar({ mobileOpen, onClose, overdueCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const content = (
    <div className="flex flex-col h-full bg-[#1E3A5F] text-white overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F0A500] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-[15px] leading-tight tracking-tight">LibraryPro</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Management System</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] px-3 mb-3">
          Navigation
        </p>
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href);
          const showBadge = badge === "!" && overdueCount > 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={
                active
                  ? "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white/15 text-white shadow-sm relative"
                  : "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all relative"
              }
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#F0A500] rounded-r-full" />
              )}
              <span
                className={
                  active
                    ? "w-7 h-7 flex items-center justify-center rounded-lg bg-[#F0A500] text-white flex-shrink-0"
                    : "w-7 h-7 flex items-center justify-center rounded-lg bg-white/8 text-white/50 group-hover:bg-white/15 group-hover:text-white flex-shrink-0 transition-all"
                }
              >
                <Icon size={15} />
              </span>
              <span className="flex-1">{label}</span>
              {showBadge && (
                <span className="w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {overdueCount > 9 ? "9+" : overdueCount}
                </span>
              )}
              {active && <ChevronRight size={13} className="text-white/40 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-white/10 flex-shrink-0 space-y-1">
        <Link
          href="/settings"
          onClick={onClose}
          className={
            isActive("/settings")
              ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white/15 text-white"
              : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white transition-all"
          }
        >
          <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/8 text-white/50 flex-shrink-0">
            <Settings size={15} />
          </span>
          Settings
        </Link>

        {/* Admin card */}
        <div className="mt-3 mx-1 px-3 py-3 bg-white/5 rounded-xl border border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F0A500] to-amber-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              JS
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-tight truncate">John Smith</p>
              <p className="text-[10px] text-[#F0A500] font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-30 shadow-2xl">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="relative flex flex-col w-64 h-full shadow-2xl z-10">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
