"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { BookOpen, Users, ArrowRight, AlertCircle, Check, Activity } from 'lucide-react';
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
  const totalFines = transactions.reduce((s, t) => s + (t.finePaid ? 0 : t.fine), 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 6);

  const overdueList = transactions.filter((t) => t.status === "overdue").slice(0, 5);

  const genreCount: Record<string, number> = {};
  books.forEach((b) => {
    genreCount[b.genre] = (genreCount[b.genre] || 0) + b.totalCopies;
  });
  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <AppShell title="Dashboard">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8e] rounded-xl p-6 mb-8 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, John!</h2>
          <p className="text-white/70 mt-1">
            Here&apos;s what&apos;s happening in your library today.
          </p>
        </div>
        <div className="hidden sm:flex gap-3">
          <Link
            href="/issue"
            className="bg-[#F0A500] hover:bg-[#d4920a] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Issue Book
          </Link>
          <Link
            href="/return"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Return Book
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Books"
          value={totalBooks}
          subtitle={availableBooks + " available"}
          icon={BookOpen}
          color="blue"
          trend={{ value: "12 added this month", up: true }}
        />
        <StatCard
          title="Active Members"
          value={activeMembers}
          subtitle={members.length + " total registered"}
          icon={Users}
          color="green"
          trend={{ value: "3 new this week", up: true }}
        />
        <StatCard
          title="Books Issued"
          value={issuedBooks}
          subtitle="Currently checked out"
          icon={ArrowRight}
          color="amber"
        />
        <StatCard
          title="Overdue Books"
          value={overdueBooks}
          subtitle="Require immediate attention"
          icon={AlertCircle}
          color="red"
          trend={{ value: overdueBooks + " need follow-up", up: false }}
        />
        <StatCard
          title="Pending Fines"
          value={"$" + totalFines.toFixed(2)}
          subtitle="Unpaid overdue fines"
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="Book Titles"
          value={books.length}
          subtitle="Unique titles in catalog"
          icon={BookOpen}
          color="blue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <Link href="/issue" className="text-sm text-[#1E3A5F] font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Book</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Due Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{t.bookTitle}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{t.memberName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{t.dueDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={t.status} variant="transaction" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Overdue Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Overdue Alerts
              </h3>
              <Link href="/overdue" className="text-sm text-[#1E3A5F] font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {overdueList.length === 0 ? (
                <div className="text-center py-4">
                  <Check size={32} className="text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No overdue books!</p>
                </div>
              ) : (
                overdueList.map((t) => (
                  <div key={t.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{t.bookTitle}</p>
                      <p className="text-xs text-gray-500">{t.memberName}</p>
                      <p className="text-xs text-red-600 font-medium">Due: {t.dueDate} · Fine: ${t.fine.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Genres */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Books by Genre</h3>
            </div>
            <div className="p-4 space-y-3">
              {topGenres.map(([genre, count]) => (
                <div key={genre}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{genre}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#1E3A5F] h-2 rounded-full"
                      style={{ width: (count / totalBooks * 100) + "%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/books/add"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center"
          >
            <BookOpen size={24} className="text-[#1E3A5F]" />
            <span className="text-sm font-medium text-[#1E3A5F]">Add Book</span>
          </Link>
          <Link
            href="/members/add"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center"
          >
            <Users size={24} className="text-green-700" />
            <span className="text-sm font-medium text-green-700">Add Member</span>
          </Link>
          <Link
            href="/issue"
            className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors text-center"
          >
            <ArrowRight size={24} className="text-[#F0A500]" />
            <span className="text-sm font-medium text-[#F0A500]">Issue Book</span>
          </Link>
          <Link
            href="/overdue"
            className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-center"
          >
            <AlertCircle size={24} className="text-red-500" />
            <span className="text-sm font-medium text-red-500">View Overdue</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
