"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { AlertCircle, Check, Activity, Clock, Users, BookOpen } from 'lucide-react';
import Link from "next/link";
import { getTransactions, updateTransaction, calculateFine } from "@/lib/store";
import { Transaction } from "@/lib/types";

export default function OverduePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const all = getTransactions();
    const overdue = all.filter((t) => t.status === "overdue" || (t.status === "issued" && new Date(t.dueDate) < new Date()));
    // Update status for any issued books that are now overdue
    overdue.forEach((t) => {
      if (t.status === "issued" && new Date(t.dueDate) < new Date()) {
        const fine = calculateFine(t.dueDate);
        updateTransaction({ ...t, status: "overdue", fine });
      }
    });
    setTransactions(getTransactions().filter((t) => t.status === "overdue"));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleMarkPaid = (tx: Transaction) => {
    updateTransaction({ ...tx, finePaid: true });
    loadData();
    showToast("Fine marked as paid for " + tx.memberName);
  };

  const handleWaiveFine = (tx: Transaction) => {
    updateTransaction({ ...tx, fine: 0, finePaid: true });
    loadData();
    showToast("Fine waived for " + tx.memberName);
  };

  const totalFines = transactions.reduce((s, t) => s + t.fine, 0);
  const unpaidFines = transactions.reduce((s, t) => s + (t.finePaid ? 0 : t.fine), 0);
  const paidFines = totalFines - unpaidFines;

  const getDaysOverdue = (dueDate: string) => {
    const diff = new Date().getTime() - new Date(dueDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <AppShell title="Overdue & Fines">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 mb-6 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Overdue Books & Fines</h2>
          <p className="text-white/80 text-sm">Track overdue returns and manage fine payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <BookOpen size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              <p className="text-xs text-gray-500">Overdue Books</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Activity size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${totalFines.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Total Fines</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${unpaidFines.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Unpaid Fines</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Check size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${paidFines.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Collected Fines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            Overdue Transactions
          </h3>
          <Link
            href="/return"
            className="text-sm text-[#1E3A5F] font-medium hover:underline"
          >
            Process Returns →
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="text-gray-700 font-semibold">No overdue books!</p>
            <p className="text-gray-400 text-sm mt-1">All books have been returned on time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Book</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Due Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Days Overdue</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Fine</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Fine Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const daysOverdue = getDaysOverdue(tx.dueDate);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-10 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                            <BookOpen size={14} className="text-red-500" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900 max-w-[160px] truncate">{tx.bookTitle}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.memberName}</p>
                          <Link
                            href={"/members/" + tx.memberId}
                            className="text-xs text-[#1E3A5F] hover:underline flex items-center gap-1"
                          >
                            <Users size={10} /> View profile
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-red-600 font-medium">{tx.dueDate}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <Clock size={11} />
                          {daysOverdue} days
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-red-600">${tx.fine.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">$1.00/day</p>
                      </td>
                      <td className="px-4 py-4">
                        {tx.finePaid ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <Check size={11} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {!tx.finePaid && tx.fine > 0 && (
                            <button
                              onClick={() => handleMarkPaid(tx)}
                              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                          {!tx.finePaid && tx.fine > 0 && (
                            <button
                              onClick={() => handleWaiveFine(tx)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              Waive
                            </button>
                          )}
                          <Link
                            href="/return"
                            className="text-xs bg-[#1E3A5F] hover:bg-[#162d4a] text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            Return
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fine Policy Info */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <Activity size={16} />
          Fine Policy
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-amber-800">
          <div>
            <p className="font-medium">Standard Rate</p>
            <p className="text-amber-700">$1.00 per day overdue</p>
          </div>
          <div>
            <p className="font-medium">Loan Period</p>
            <p className="text-amber-700">14 days standard borrowing</p>
          </div>
          <div>
            <p className="font-medium">Maximum Fine</p>
            <p className="text-amber-700">No cap — accrues daily</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
