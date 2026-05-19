"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { ArrowLeft, Users, Save } from 'lucide-react';
import Link from "next/link";
import { addMember, generateId, getMembers } from "@/lib/store";
import { Member } from "@/lib/types";

export default function AddMemberPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active" as Member["status"],
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  };

  const generateMembershipId = () => {
    const existing = getMembers();
    const num = (existing.length + 1).toString().padStart(3, "0");
    return "LIB-" + new Date().getFullYear() + "-" + num;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    const member: Member = {
      id: generateId("m"),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      membershipId: generateMembershipId(),
      joinedAt: new Date().toISOString().split("T")[0],
      status: form.status,
      totalBorrowed: 0,
      currentlyBorrowed: 0,
    };
    addMember(member);
    setTimeout(() => {
      router.push("/members");
    }, 500);
  };

  return (
    <AppShell title="Add New Member">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A5F] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Members
        </Link>

        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8e] rounded-xl p-6 mb-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Register New Member</h2>
            <p className="text-white/70 text-sm">Add a new member to the library system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Alice Johnson"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.name ? "border-red-400" : "border-gray-200")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="alice@example.com"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.email ? "border-red-400" : "border-gray-200")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+1-555-0100"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.phone ? "border-red-400" : "border-gray-200")}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="123 Main Street, City, State ZIP"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.address ? "border-red-400" : "border-gray-200")}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Membership Status</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 bg-white"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-[#1E3A5F] font-medium">Membership ID</p>
            <p className="text-xs text-gray-500 mt-0.5">
              A unique membership ID will be automatically generated upon registration.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/members"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#162d4a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Registering..." : "Register Member"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
