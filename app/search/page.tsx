"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { Search, BookOpen, Users, ArrowRight } from 'lucide-react';
import Link from "next/link";
import { getBooks, getMembers } from "@/lib/store";
import { Book, Member } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [memberResults, setMemberResults] = useState<Member[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (q: string) => {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    const books = getBooks().filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower) ||
        b.isbn.toLowerCase().includes(lower) ||
        b.genre.toLowerCase().includes(lower) ||
        b.publisher.toLowerCase().includes(lower)
    );
    const members = getMembers().filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.email.toLowerCase().includes(lower) ||
        m.membershipId.toLowerCase().includes(lower) ||
        m.phone.includes(lower)
    );
    setBookResults(books);
    setMemberResults(members);
    setSearched(true);
    setQuery(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push("/search?q=" + encodeURIComponent(inputValue.trim()));
      performSearch(inputValue.trim());
    }
  };

  const HighlightText = ({ text, q }: { text: string; q: string }) => {
    if (!q) return <span>{text}</span>;
    const lower = q.toLowerCase();
    const idx = text.toLowerCase().indexOf(lower);
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </span>
    );
  };

  const totalResults = bookResults.length + memberResults.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Global Search</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search books by title, author, ISBN, genre · Search members by name, email, ID..."
              className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#1E3A5F] hover:bg-[#162d4a] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {["Fiction", "Non-Fiction", "Science Fiction", "Self-Help", "Technology"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setInputValue(tag);
                router.push("/search?q=" + encodeURIComponent(tag));
                performSearch(tag);
              }}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {totalResults === 0
                ? "No results found"
                : totalResults + " result" + (totalResults !== 1 ? "s" : "") + " for \"" + query + "\""}
            </p>
            <div className="flex gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <BookOpen size={12} /> {bookResults.length} books
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} /> {memberResults.length} members
              </span>
            </div>
          </div>

          {totalResults === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Search size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold">No results found for &quot;{query}&quot;</p>
              <p className="text-gray-400 text-sm mt-1">Try different keywords or check the spelling</p>
              <div className="mt-4 flex gap-3 justify-center">
                <Link href="/books" className="text-sm text-[#1E3A5F] hover:underline">Browse all books</Link>
                <span className="text-gray-300">·</span>
                <Link href="/members" className="text-sm text-[#1E3A5F] hover:underline">Browse all members</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Book Results */}
              {bookResults.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <BookOpen size={16} className="text-[#1E3A5F]" />
                      Books ({bookResults.length})
                    </h3>
                    <Link href="/books" className="text-sm text-[#1E3A5F] hover:underline">View all books</Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {bookResults.map((book) => (
                      <div key={book.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-12 bg-[#1E3A5F]/10 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen size={16} className="text-[#1E3A5F]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            <HighlightText text={book.title} q={query} />
                          </p>
                          <p className="text-xs text-gray-500">
                            <HighlightText text={book.author} q={query} /> · {book.genre} · {book.year}
                          </p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            <HighlightText text={book.isbn} q={query} />
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge
                            status={book.availableCopies > 0 ? "available" : "issued"}
                            variant="book"
                          />
                          <Link
                            href={"/books/" + book.id + "/edit"}
                            className="p-1.5 text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Member Results */}
              {memberResults.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Users size={16} className="text-[#1E3A5F]" />
                      Members ({memberResults.length})
                    </h3>
                    <Link href="/members" className="text-sm text-[#1E3A5F] hover:underline">View all members</Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {memberResults.map((member) => (
                      <div key={member.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            <HighlightText text={member.name} q={query} />
                          </p>
                          <p className="text-xs text-gray-500">
                            <HighlightText text={member.email} q={query} /> ·{" "}
                            <HighlightText text={member.membershipId} q={query} />
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {member.currentlyBorrowed} books currently borrowed
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge status={member.status} variant="member" />
                          <Link
                            href={"/members/" + member.id}
                            className="p-1.5 text-gray-400 hover:text-[#1E3A5F] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Search across your library</p>
          <p className="text-gray-400 text-sm mt-1">Find books by title, author, ISBN, or genre · Find members by name, email, or ID</p>
          <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <Link
              href="/books"
              className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm font-medium text-[#1E3A5F] hover:bg-blue-100 transition-colors"
            >
              <BookOpen size={16} />
              Browse Books
            </Link>
            <Link
              href="/members"
              className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
            >
              <Users size={16} />
              Browse Members
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AppShell title="Search">
      <Suspense fallback={
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </AppShell>
  );
}
