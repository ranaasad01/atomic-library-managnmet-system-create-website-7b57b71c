"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import { ArrowLeft, BookOpen, Save } from 'lucide-react';
import Link from "next/link";
import { getBooks, updateBook } from "@/lib/store";
import { Book } from "@/lib/types";

const GENRES = ["Classic Fiction", "Dystopian Fiction", "Adventure Fiction", "Non-Fiction", "Self-Help", "Business", "Science Fiction", "Finance", "Fantasy", "Technology", "Contemporary Fiction", "Biography", "History", "Romance", "Mystery", "Thriller"];

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "Classic Fiction",
    publisher: "",
    year: "",
    totalCopies: "",
    availableCopies: "",
    description: "",
  });

  useEffect(() => {
    const books = getBooks();
    const found = books.find((b) => b.id === id);
    if (found) {
      setBook(found);
      setForm({
        title: found.title,
        author: found.author,
        isbn: found.isbn,
        genre: found.genre,
        publisher: found.publisher,
        year: found.year.toString(),
        totalCopies: found.totalCopies.toString(),
        availableCopies: found.availableCopies.toString(),
        description: found.description,
      });
    }
  }, [id]);

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
    const total = parseInt(form.totalCopies);
    if (isNaN(total) || total < 1) e.totalCopies = "Must be at least 1";
    const avail = parseInt(form.availableCopies);
    if (isNaN(avail) || avail < 0) e.availableCopies = "Cannot be negative";
    if (!isNaN(total) && !isNaN(avail) && avail > total) e.availableCopies = "Cannot exceed total copies";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    const updated: Book = {
      ...book,
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      genre: form.genre,
      publisher: form.publisher.trim(),
      year: parseInt(form.year),
      totalCopies: parseInt(form.totalCopies),
      availableCopies: parseInt(form.availableCopies),
      description: form.description.trim(),
    };
    updateBook(updated);
    setTimeout(() => {
      router.push("/books");
    }, 500);
  };

  if (!book) {
    return (
      <AppShell title="Edit Book">
        <div className="text-center py-20">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Book not found.</p>
          <Link href="/books" className="text-[#1E3A5F] text-sm mt-2 inline-block hover:underline">
            Back to catalog
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Edit Book">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A5F] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Books Catalog
        </Link>

        <div className="bg-gradient-to-r from-[#F0A500] to-[#d4920a] rounded-xl p-6 mb-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Edit Book</h2>
            <p className="text-white/80 text-sm">Update the details for &quot;{book.title}&quot;</p>
          </div>
        </div>

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
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.isbn ? "border-red-400" : "border-gray-200")}
              />
              {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Genre</label>
              <select
                value={form.genre}
                onChange={(e) => update("genre", e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 bg-white"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Available Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.availableCopies}
                onChange={(e) => update("availableCopies", e.target.value)}
                min="0"
                className={"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] " + (errors.availableCopies ? "border-red-400" : "border-gray-200")}
              />
              {errors.availableCopies && <p className="text-red-500 text-xs mt-1">{errors.availableCopies}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 resize-none"
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
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F0A500] hover:bg-[#d4920a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
