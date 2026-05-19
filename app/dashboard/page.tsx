"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { BookOpen, Users, ArrowRight, ArrowLeft, AlertCircle, Check, Activity, Plus, Clock, TrendingUp, Calendar } from 'lucide-react';
import { getBooks, getMembers, getTransactions } from "@/lib/store";
import { Book, Member, Transaction } from "@/lib/types";

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setBooks(getBooks());
    setMembers(getMembers());
    setTransactions(getTransactions());
  }, []);

  const totalBooks = books.reduce((s, b) => s + b.totalCopies, 0);
  const availableBooks = books.reduce((s, b) => s + b.availableCopies, 0);
  const issuedBooks = transactions.filter((t) => t.status === "issued" || t.status === "overdue").length;
  const overdueBooks = transactions.filter((t) => t.status === "overdue").length;
  const activeMembers = members.filter((m) => m.status === "active").length;
  const unpaidFines = transactions.reduce((s, t) => s + (t.finePaid ? 0 : t.fine), 0);
  const collectedFines = transactions.reduce((s, t) => s + (t.finePaid ? t.fine : 0), 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 8);

  const overdueList = transactions.filter((t) => t.status === "overdue");

  // Genre breakdown
  const genreCount: Record<string, number> = {};
  books.forEach((b) => {
    genreCount[b.genre] = (genreCount[b.genre] || 0) + b.totalCopies;
  });
  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxGenreCount = topGenres[0]?.[1] ?? 1;

  // Activity feed (combine transactions into timeline)
  const activityFeed = [...transactions]
    .sort((a, b) => {
      const dateA = a.returnDate || a.issueDate;
      const dateB = b.returnDate || b.issueDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 6);

  const getActivityIcon = (t: Transaction) => {
    if (t.status === "returned") return { icon: Check, bg: "bg-green-100", color: "text-green-600", label: "Returned" };
    if (t.status === "overdue") return { icon: AlertCircle, bg: "bg-red-100", color: "text-red-500", label: "Overdue" };
    return { icon: ArrowRight, bg: "bg-blue-100", color: "text-blue-600", label: "Issued" };
  };

  // Top borrowed books
  const borrowCounts: Record<string, { title: string; count: number }> = {};
  transactions.forEach((t) => {
    if (!borrowCounts[t.bookId]) borrowCounts[t.bookId] = { title: t.bookTitle, count: 0 };
    borrowCounts[t.bookId].count++;
  });
  const topBooks = Object.values(borrowCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <AppShell title="Dashboard">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A5F] via-[#1e4a7a] to-[#2d5a8e] rounded-2xl p-6 mb-7 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 right-24 w-28 h-28 bg-[#F0A500]/10 rounded-full" />
        <div className="absolute top-4 right-48 w-10 h-10 bg-white/5 rounded-full" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1 flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
            <h2 className="text-2xl font-bold">Welcome back, Ali! 👋</h2>
            <p className="text-white/60 mt-1 text-sm">
              Your library has{" "}
              <span className="text-[#F0A500] font-semibold">{overdueBooks} overdue book{overdueBooks !== 1 ? "s" : ""}</span>
              {" "}and{" "}
              <span className="text-[#F0A500] font-semibold">{issuedBooks} currently issued</span>.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              href="/issue"
              className="inline-flex items-center gap-2 bg-[#F0A500] hover:bg-[#d4920a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-amber-500/20"
            >
              <ArrowRight size={15} />
              Issue Book
            </Link>
            <Link
              href="/return"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-white/10"
            >
              <ArrowLeft size={15} />
              Return
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-7">
        {/* Compact stat tiles */}
        {[
          { label: "Total Books", value: totalBooks, sub: availableBooks + " available", color: "bg-blue-50 border-blue-100", val: "text-[#1E3A5F]", icon: BookOpen, iconBg: "bg-[#1E3A5F]" },
          { label: "Active Members", value: activeMembers, sub: members.length + " total", color: "bg-green-50 border-green-100", val: "text-green-700", icon: Users, iconBg: "bg-green-600" },
          { label: "Issued Books", value: issuedBooks, sub: "checked out", color: "bg-amber-50 border-amber-100", val: "text-amber-700", icon: ArrowRight, iconBg: "bg-[#F0A500]" },
          { label: "Overdue", value: overdueBooks, sub: "need attention", color: "bg-red-50 border-red-100", val: "text-red-600", icon: AlertCircle, iconBg: "bg-red-500" },
          { label: "Unpaid Fines", value: "$" + unpaidFines.toFixed(2), sub: "outstanding", color: "bg-purple-50 border-purple-100", val: "text-purple-700", icon: Activity, iconBg: "bg-purple-600" },
          { label: "Collected", value: "$" + collectedFines.toFixed(2), sub: "fines paid", color: "bg-teal-50 border-teal-100", val: "text-teal-700", icon: Check, iconBg: "bg-teal-600" },
        ].map((s) => (
          <div key={s.label} className={"rounded-xl p-4 border " + s.color + " flex flex-col gap-2"}>
            <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + s.iconBg}>
              <s.icon size={15} className="text-white" />
            </div>
            <div>
              <p className={"text-xl font-bold leading-tight " + s.val}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Recent Transactions — spans 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-xs text-gray-400 mt-0.5">{transactions.length} total records</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/issue"
                className="inline-flex items-center gap-1.5 text-xs bg-[#1E3A5F] hover:bg-[#162d4a] text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <Plus size={12} /> New
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Book</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Member</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Issued</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Due</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-9 bg-[#1E3A5F]/8 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen size={12} className="text-[#1E3A5F]/60" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">{t.bookTitle}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                          {t.memberName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <p className="text-sm text-gray-600 truncate max-w-[100px]">{t.memberName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-gray-500">{t.issueDate}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className={"text-xs font-medium " + (t.status === "overdue" ? "text-red-600" : "text-gray-500")}>
                        {t.dueDate}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={t.status} variant="transaction" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50">
            <Link href="/return" className="text-xs text-[#1E3A5F] font-semibold hover:underline">
              View all transactions →
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Overdue Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={12} className="text-red-500" />
                </span>
                Overdue Alerts
                {overdueList.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {overdueList.length}
                  </span>
                )}
              </h3>
              <Link href="/overdue" className="text-xs text-[#1E3A5F] font-semibold hover:underline">
                Manage
              </Link>
            </div>
            <div className="p-4 space-y-2.5 max-h-64 overflow-y-auto">
              {overdueList.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={18} className="text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">All clear!</p>
                  <p className="text-xs text-gray-400 mt-0.5">No overdue books right now.</p>
                </div>
              ) : (
                overdueList.map((t) => (
                  <div key={t.id} className="flex items-start gap-2.5 p-3 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">{t.bookTitle}</p>
                      <p className="text-[11px] text-gray-500">Rao Ali</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-red-600 font-semibold">Due {t.dueDate}</span>
                        <span className="text-[11px] text-red-500">· ${t.fine.toFixed(2)} fine</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Borrowed Books */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <TrendingUp size={14} className="text-[#F0A500]" />
                Most Borrowed
              </h3>
            </div>
            <div className="p-4 space-y-2.5">
              {topBooks.map((b, i) => (
                <div key={b.title} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs font-medium text-gray-800 flex-1 truncate">{b.title}</p>
                  <span className="text-xs text-gray-400 font-medium flex-shrink-0">{b.count}×</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Collection by Genre</h3>
            <p className="text-xs text-gray-400 mt-0.5">{books.length} titles across {topGenres.length} genres</p>
          </div>
          <div className="p-5 space-y-3.5">
            {topGenres.map(([genre, count], i) => {
              const pct = Math.round((count / maxGenreCount) * 100);
              const colors = ["bg-[#1E3A5F]", "bg-[#F0A500]", "bg-green-500", "bg-purple-500", "bg-teal-500", "bg-pink-500"];
              return (
                <div key={genre}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{genre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{count} copies</span>
                      <span className="text-xs font-semibold text-gray-600">{Math.round(count / totalBooks * 100)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={"h-2 rounded-full transition-all " + colors[i % colors.length]}
                      style={{ width: pct + "%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Activity Feed</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest library activity</p>
          </div>
          <div className="p-5">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100" />
              <div className="space-y-4">
                {activityFeed.map((t) => {
                  const info = getActivityIcon(t);
                  const date = t.returnDate || t.issueDate;
                  return (
                    <div key={t.id} className="flex items-start gap-3 relative">
                      <div className={"w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 " + info.bg}>
                        <info.icon size={13} className={info.color} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-xs font-semibold text-gray-900 truncate">{t.bookTitle}</p>
                        <p className="text-[11px] text-gray-500">
                          {info.label} by {t.memberName}
                          {t.fine > 0 && !t.finePaid && (
                            <span className="text-red-500 font-medium"> · ${t.fine.toFixed(2)} fine</span>
                          )}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 pt-0.5">{date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-[#F0A500]" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/books/add", icon: BookOpen, label: "Add Book", sub: "New catalog entry", bg: "bg-blue-50 hover:bg-blue-100", icon_color: "text-[#1E3A5F]", icon_bg: "bg-[#1E3A5F]/10" },
            { href: "/members/add", icon: Users, label: "Add Member", sub: "Register member", bg: "bg-green-50 hover:bg-green-100", icon_color: "text-green-700", icon_bg: "bg-green-100" },
            { href: "/issue", icon: ArrowRight, label: "Issue Book", sub: "Lend to member", bg: "bg-amber-50 hover:bg-amber-100", icon_color: "text-[#F0A500]", icon_bg: "bg-amber-100" },
            { href: "/overdue", icon: AlertCircle, label: "View Overdue", sub: overdueBooks + " pending", bg: "bg-red-50 hover:bg-red-100", icon_color: "text-red-500", icon_bg: "bg-red-100" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={"flex items-center gap-3 p-4 rounded-xl transition-colors " + a.bg}
            >
              <div className={"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 " + a.icon_bg}>
                <a.icon size={20} className={a.icon_color} />
              </div>
              <div>
                <p className={"text-sm font-semibold " + a.icon_color}>{a.label}</p>
                <p className="text-xs text-gray-500">{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}