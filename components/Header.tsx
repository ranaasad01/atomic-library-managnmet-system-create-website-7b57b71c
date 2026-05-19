"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, X, BookOpen, Users, AlertCircle } from 'lucide-react';
import Link from "next/link";
import { getTransactions, getBooks, getMembers } from "@/lib/store";
import { Transaction } from "@/lib/types";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [overdueList, setOverdueList] = useState<Transaction[]>([]);
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const txs = getTransactions().filter((t) => t.status === "overdue");
    setOverdueList(txs);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push("/search?q=" + encodeURIComponent(query.trim()));
      setQuery("");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#1E3A5F] leading-tight">{title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books, members…"
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] focus:bg-white w-56 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </form>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell size={19} />
            {overdueList.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {overdueList.length > 9 ? "9+" : overdueList.length}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900">Notifications</p>
                {overdueList.length > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    {overdueList.length} overdue
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {overdueList.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={28} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">All caught up!</p>
                    <p className="text-xs text-gray-400">No overdue books right now.</p>
                  </div>
                ) : (
                  overdueList.map((t) => (
                    <div key={t.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                      <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle size={13} className="text-red-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900 truncate">{t.bookTitle}</p>
                        <p className="text-xs text-gray-500">{t.memberName}</p>
                        <p className="text-xs text-red-500 font-medium mt-0.5">
                          Due {t.dueDate} · Fine ${t.fine.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <Link
                  href="/overdue"
                  onClick={() => setShowNotifs(false)}
                  className="text-xs text-[#1E3A5F] font-semibold hover:underline"
                >
                  View all overdue books →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2d5a8e] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            MA
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-tight">Muhammad Ali</p>
            <p className="text-[10px] text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}