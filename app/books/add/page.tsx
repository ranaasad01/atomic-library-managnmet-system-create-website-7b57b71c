"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { ArrowLeft, BookOpen, Save } from 'lucide-react';
import Link from "next/link";
import { addBook, generateId } from "@/lib/store";
import { Book } from "@/lib/types";

const GENRES = ["Classic Fiction", "Dystopian Fiction", "Adventure Fiction", "Non-Fiction", "Self-Help", "Business", "Science Fiction", "Finance", "Fantasy", "Technology", "Contemporary Fiction", "Biography", "History", "Romance", "Mystery", "Thriller"];

export default function AddBookPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "Classic Fiction",
    publisher: "",
    year: new Date().getFullYear().toString(),
    totalCopies: "1",
    description: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.isbn.trim()) e.isbn = "ISBN is required";
    if (!form.publisher.trim()) e.publisher = "Publisher is required";
    const yr = parseInt(form.year);
    if (isNaN(yr) || yr < 1000 || yr > new Date().getFullYear()) e.year = "Enter a valid year";
    const copies = parseInt(form.totalCopies);
    if (isNaN(copies) || copies < 1) e.totalCopies = "Must be at least 1";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    const book: Book = {
      id: generateId("b"),
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      genre: form.genre,
      publisher: form.publisher.trim(),
      year: parseInt(form.year),
      totalCopies: parseInt(form.totalCopies),
      availableCopies: parseInt(form.totalCopies),
      description: form.description.trim(),
      addedAt: new Date().toISOString().split("T")[0],
    };
    addBook(book);
    setTimeout(() => {
      router.push("/books");
    }, 500);
  };

  return (
    <AppShell title="Add New Book">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A5F] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Books Catalog
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8e] rounded-xl p-6 mb-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Add New Book</h2>
            <p className="text-white/70 text-sm">Fill in the details to add a book to the catalog</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. The Great Gatsby"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.title ? "border-red-400" : "border-gray-200")}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="e.g. F. Scott Fitzgerald"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.author ? "border-red-400" : "border-gray-200")}
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ISBN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => update("isbn", e.target.value)}
                placeholder="e.g. 978-0-7432-7356-5"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.isbn ? "border-red-400" : "border-gray-200")}
              />
              {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Genre</label>
              <select
                value={form.genre}
                onChange={(e) => update("genre", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] bg-white"
              >
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Publisher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.publisher}
                onChange={(e) => update("publisher", e.target.value)}
                placeholder="e.g. Scribner"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.publisher ? "border-red-400" : "border-gray-200")}
              />
              {errors.publisher && <p className="text-red-500 text-xs mt-1">{errors.publisher}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Publication Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                placeholder="e.g. 2023"
                min="1000"
                max={new Date().getFullYear()}
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.year ? "border-red-400" : "border-gray-200")}
              />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Total Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.totalCopies}
                onChange={(e) => update("totalCopies", e.target.value)}
                min="1"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.totalCopies ? "border-red-400" : "border-gray-200")}
              />
              {errors.totalCopies && <p className="text-red-500 text-xs mt-1">{errors.totalCopies}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Brief description of the book..."
                rows={3}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/books"
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
              {saving ? "Saving..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
