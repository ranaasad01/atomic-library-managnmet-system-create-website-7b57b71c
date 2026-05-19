"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { ArrowLeft, Users, Edit, Mail, Phone, MapPin, Calendar, BookOpen, Clock } from 'lucide-react';
import { getMembers, getTransactions } from "@/lib/store";
import { Member, Transaction } from "@/lib/types";

export default function MemberDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<Member | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const members = getMembers();
    const found = members.find((m) => m.id === id);
    setMember(found || null);
    const txs = getTransactions().filter((t) => t.memberId === id);
    setTransactions(txs.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()));
  }, [id]);

  if (!member) {
    return (
      <AppShell title="Member Detail">
        <div className="text-center py-20">
          <Users size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Member not found.</p>
          <Link href="/members" className="text-[#1E3A5F] text-sm mt-2 inline-block hover:underline">
            Back to members
          </Link>
        </div>
      </AppShell>
    );
  }

  const totalFines = transactions.reduce((s, t) => s + t.fine, 0);
  const unpaidFines = transactions.reduce((s, t) => s + (t.finePaid ? 0 : t.fine), 0);
  const currentlyBorrowed = transactions.filter((t) => t.status === "issued" || t.status === "overdue");
  const initials = member.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <AppShell title="Member Detail">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A5F] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Members
        </Link>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8e] rounded-xl p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <Badge status={member.status} variant="member" />
              </div>
              <p className="text-white/70 text-sm mt-1">{member.membershipId}</p>
            </div>
            <Link
              href={"/members/" + member.id + "/edit"}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Edit size={15} />
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Contact Info */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail size={15} className="text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone size={15} className="text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{member.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin size={15} className="text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900">{member.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar size={15} className="text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">{member.joinedAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <BookOpen size={18} className="text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{member.totalBorrowed}</p>
                  <p className="text-xs text-gray-500">Total Books Borrowed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock size={18} className="text-[#F0A500]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentlyBorrowed.length}</p>
                  <p className="text-xs text-gray-500">Currently Borrowed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <span className="text-red-500 font-bold text-sm">$</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${unpaidFines.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Unpaid Fines</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currently Borrowed */}
        {currentlyBorrowed.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Currently Borrowed</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {currentlyBorrowed.map((t) => (
                <div key={t.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.bookTitle}</p>
                    <p className="text-xs text-gray-500">Issued: {t.issueDate} · Due: {t.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.fine > 0 && (
                      <span className="text-xs text-red-600 font-medium">Fine: ${t.fine.toFixed(2)}</span>
                    )}
                    <Badge status={t.status} variant="transaction" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Borrowing History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Borrowing History</h3>
            <p className="text-xs text-gray-400 mt-0.5">{transactions.length} total transactions · Total fines: ${totalFines.toFixed(2)}</p>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No borrowing history yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Book</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Issue Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Due Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Return Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Fine</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium text-gray-900">{t.bookTitle}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.issueDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.dueDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.returnDate || "—"}</td>
                      <td className="px-4 py-3">
                        {t.fine > 0 ? (
                          <span className={t.finePaid ? "text-sm text-green-600" : "text-sm text-red-600 font-medium"}>
                            ${t.fine.toFixed(2)} {t.finePaid ? "(paid)" : "(unpaid)"}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={t.status} variant="transaction" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
