"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { ArrowRight, Search, BookOpen, Users, Check, AlertCircle } from 'lucide-react';
import Link from "next/link";
import { getBooks, getMembers, addTransaction, updateBook, updateMember, generateId } from "@/lib/store";
import { Book, Member, Transaction } from "@/lib/types";

export default function IssueBookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [bookSearch, setBookSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setBooks(getBooks());
    setMembers(getMembers());
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 14);
    setDueDate(defaultDue.toISOString().split("T")[0]);
  }, []);

  const filteredBooks = books.filter((b) => {
    const q = bookSearch.toLowerCase();
    return (
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    );
  }).filter((b) => b.availableCopies > 0).slice(0, 8);

  const filteredMembers = members.filter((m) => {
    const q = memberSearch.toLowerCase();
    return (
      (!q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.membershipId.toLowerCase().includes(q)) &&
      m.status === "active"
    );
  }).slice(0, 8);

  const handleIssue = () => {
    setError("");
    if (!selectedBook) { setError("Please select a book."); return; }
    if (!selectedMember) { setError("Please select a member."); return; }
    if (!dueDate) { setError("Please set a due date."); return; }
    if (selectedBook.availableCopies < 1) { setError("No copies available for this book."); return; }
    if (selectedMember.status !== "active") { setError("Member account is not active."); return; }

    const tx: Transaction = {
      id: generateId("t"),
      bookId: selectedBook.id,
      memberId: selectedMember.id,
      bookTitle: selectedBook.title,
      memberName: selectedMember.name,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate,
      status: "issued",
      fine: 0,
      finePaid: false,
    };
    addTransaction(tx);

    const updatedBook: Book = {
      ...selectedBook,
      availableCopies: selectedBook.availableCopies - 1,
    };
    updateBook(updatedBook);

    const updatedMember: Member = {
      ...selectedMember,
      currentlyBorrowed: selectedMember.currentlyBorrowed + 1,
      totalBorrowed: selectedMember.totalBorrowed + 1,
    };
    updateMember(updatedMember);

    setSuccess(true);
    setBooks(getBooks());
    setMembers(getMembers());
  };

  const handleReset = () => {
    setSelectedBook(null);
    setSelectedMember(null);
    setBookSearch("");
    setMemberSearch("");
    setSuccess(false);
    setError("");
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 14);
    setDueDate(defaultDue.toISOString().split("T")[0]);
  };

  if (success) {
    return (
      <AppShell title="Issue Book">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Issued Successfully!</h2>
          <p className="text-gray-500 mb-2">
            <span className="font-semibold text-gray-900">{selectedBook?.title}</span> has been issued to{" "}
            <span className="font-semibold text-gray-900">{selectedMember?.name}</span>.
          </p>
          <p className="text-sm text-gray-400 mb-8">Due date: {dueDate}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#1E3A5F] hover:bg-[#162d4a] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Issue Another Book
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
    <AppShell title="Issue Book">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F0A500] to-[#d4920a] rounded-xl p-6 mb-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowRight size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Issue a Book</h2>
            <p className="text-white/80 text-sm">Select a book and member to complete the borrowing process</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Book Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-[#1E3A5F]" />
              Select Book
            </h3>
            {selectedBook ? (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-10 h-12 bg-[#1E3A5F]/10 rounded flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-[#1E3A5F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{selectedBook.title}</p>
                  <p className="text-xs text-gray-500">{selectedBook.author}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{selectedBook.availableCopies} copies available</p>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-xs text-blue-600 hover:underline flex-shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <div className="relative mb-3">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    placeholder="Search available books..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                  />
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredBooks.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No available books found</p>
                  ) : (
                    filteredBooks.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => setSelectedBook(book)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 text-left transition-colors"
                      >
                        <div className="w-8 h-10 bg-[#1E3A5F]/10 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen size={14} className="text-[#1E3A5F]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.author}</p>
                        </div>
                        <span className="text-xs text-green-600 font-medium flex-shrink-0">{book.availableCopies} avail.</span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Member Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#1E3A5F]" />
              Select Member
            </h3>
            {selectedMember ? (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-9 h-9 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {selectedMember.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{selectedMember.name}</p>
                  <p className="text-xs text-gray-500">{selectedMember.membershipId}</p>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-xs text-blue-600 hover:underline flex-shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <div className="relative mb-3">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search active members..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                  />
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredMembers.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No active members found</p>
                  ) : (
                    filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 text-left transition-colors"
                      >
                        <div className="w-8 h-8 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.membershipId}</p>
                        </div>
                        <Badge status={member.status} variant="member" />
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Due Date & Confirm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Borrowing Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Date</label>
              <input
                type="text"
                value={new Date().toISOString().split("T")[0]}
                readOnly
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
              />
            </div>
          </div>

          {/* Summary */}
          {(selectedBook || selectedMember) && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
              <p className="text-sm font-semibold text-gray-700">Transaction Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Book:</span>
                <span className="font-medium text-gray-900">{selectedBook?.title || "Not selected"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Member:</span>
                <span className="font-medium text-gray-900">{selectedMember?.name || "Not selected"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium text-gray-900">{dueDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fine Rate:</span>
                <span className="font-medium text-gray-900">$1.00 per day overdue</span>
              </div>
            </div>
          )}

          <button
            onClick={handleIssue}
            disabled={!selectedBook || !selectedMember || !dueDate}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#F0A500] hover:bg-[#d4920a] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight size={18} />
            Issue Book
          </button>
        </div>
      </div>
    </AppShell>
  );
}
