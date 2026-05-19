"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { ArrowLeft, Search, Check, AlertCircle, BookOpen } from 'lucide-react';
import Link from "next/link";
import { getTransactions, updateTransaction, updateBook, updateMember, getBooks, getMembers, calculateFine } from "@/lib/store";
import { Transaction } from "@/lib/types";

export default function ReturnBookPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [success, setSuccess] = useState(false);
  const [calculatedFine, setCalculatedFine] = useState(0);

  useEffect(() => {
    const txs = getTransactions().filter((t) => t.status === "issued" || t.status === "overdue");
    setTransactions(txs);
  }, []);

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      !q ||
      t.bookTitle.toLowerCase().includes(q) ||
      t.memberName.toLowerCase().includes(q) ||
      t.memberId.toLowerCase().includes(q)
    );
  });

  const handleSelect = (tx: Transaction) => {
    setSelectedTx(tx);
    const fine = calculateFine(tx.dueDate, returnDate);
    setCalculatedFine(fine);
  };

  const handleReturnDateChange = (date: string) => {
    setReturnDate(date);
    if (selectedTx) {
      setCalculatedFine(calculateFine(selectedTx.dueDate, date));
    }
  };

  const handleReturn = () => {
    if (!selectedTx) return;

    const updatedTx: Transaction = {
      ...selectedTx,
      returnDate,
      status: "returned",
      fine: calculatedFine,
      finePaid: calculatedFine === 0,
    };
    updateTransaction(updatedTx);

    const books = getBooks();
    const book = books.find((b) => b.id === selectedTx.bookId);
    if (book) {
      updateBook({ ...book, availableCopies: book.availableCopies + 1 });
    }

    const members = getMembers();
    const member = members.find((m) => m.id === selectedTx.memberId);
    if (member) {
      updateMember({
        ...member,
        currentlyBorrowed: Math.max(0, member.currentlyBorrowed - 1),
      });
    }

    setSuccess(true);
    setTransactions(getTransactions().filter((t) => t.status === "issued" || t.status === "overdue"));
  };

  const handleReset = () => {
    setSelectedTx(null);
    setSuccess(false);
    setSearch("");
    setReturnDate(new Date().toISOString().split("T")[0]);
    setCalculatedFine(0);
    const txs = getTransactions().filter((t) => t.status === "issued" || t.status === "overdue");
    setTransactions(txs);
  };

  if (success && selectedTx) {
    return (
      <AppShell title="Return Book">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Returned Successfully!</h2>
          <p className="text-gray-500 mb-2">
            <span className="font-semibold text-gray-900">{selectedTx.bookTitle}</span> has been returned by{" "}
            <span className="font-semibold text-gray-900">{selectedTx.memberName}</span>.
          </p>
          {calculatedFine > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <AlertCircle size={16} />
                Fine Applied
              </p>
              <p className="text-sm text-amber-700 mt-1">
                A fine of <span className="font-bold">${calculatedFine.toFixed(2)}</span> has been applied for overdue return.
              </p>
              <Link href="/overdue" className="text-xs text-amber-600 underline mt-1 inline-block">
                Manage fines →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-green-600 mb-6">No fine applied — returned on time!</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#1E3A5F] hover:bg-[#162d4a] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Return Another Book
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Return Book">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8e] rounded-xl p-6 mb-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowLeft size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Return a Book</h2>
            <p className="text-white/70 text-sm">Process book returns and calculate any applicable fines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issued Books List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-[#1E3A5F]" />
              Currently Issued Books
              <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{transactions.length}</span>
            </h3>
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by book or member..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-8">
                  <Check size={32} className="text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No books currently issued</p>
                </div>
              ) : (
                filtered.map((tx) => (
                  <button
                    key={tx.id}
                    onClick={() => handleSelect(tx)}
                    className={"w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors " + (selectedTx?.id === tx.id ? "border-[#1E3A5F] bg-blue-50" : "border-gray-100 hover:bg-gray-50")}
                  >
                    <div className="w-8 h-10 bg-[#1E3A5F]/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen size={14} className="text-[#1E3A5F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{tx.bookTitle}</p>
                      <p className="text-xs text-gray-500">{tx.memberName}</p>
                      <p className="text-xs text-gray-400">Due: {tx.dueDate}</p>
                    </div>
                    <Badge status={tx.status} variant="transaction" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Return Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Return Details</h3>
            {!selectedTx ? (
              <div className="text-center py-12">
                <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Select a book from the list to process its return</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Selected Transaction</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Book:</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%]">{selectedTx.bookTitle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Member:</span>
                    <span className="font-medium text-gray-900">{selectedTx.memberName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Issue Date:</span>
                    <span className="font-medium text-gray-900">{selectedTx.issueDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due Date:</span>
                    <span className={"font-medium " + (new Date(selectedTx.dueDate) < new Date() ? "text-red-600" : "text-gray-900")}>
                      {selectedTx.dueDate}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => handleReturnDateChange(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                  />
                </div>

                {/* Fine Calculation */}
                <div className={"rounded-lg p-4 " + (calculatedFine > 0 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200")}>
                  <p className="text-sm font-semibold mb-1" style={{ color: calculatedFine > 0 ? "#dc2626" : "#16a34a" }}>
                    Fine Calculation
                  </p>
                  {calculatedFine > 0 ? (
                    <div>
                      <p className="text-2xl font-bold text-red-600">${calculatedFine.toFixed(2)}</p>
                      <p className="text-xs text-red-500 mt-1">
                        Overdue by {Math.floor((new Date(returnDate).getTime() - new Date(selectedTx.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days × $1.00/day
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-bold text-green-600">$0.00</p>
                      <p className="text-xs text-green-600 mt-1">Returned on time — no fine!</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleReturn}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#162d4a] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Check size={18} />
                  Confirm Return
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
