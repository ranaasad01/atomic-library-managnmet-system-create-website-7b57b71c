import { Book, Member, Transaction } from "./types";
import { MOCK_BOOKS, MOCK_MEMBERS, MOCK_TRANSACTIONS } from "./mockData";

const BOOKS_KEY = "lms_books";
const MEMBERS_KEY = "lms_members";
const TRANSACTIONS_KEY = "lms_transactions";

function isClient() {
  return typeof window !== "undefined";
}

export function getBooks(): Book[] {
  if (!isClient()) return MOCK_BOOKS;
  const stored = localStorage.getItem(BOOKS_KEY);
  if (!stored) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(MOCK_BOOKS));
    return MOCK_BOOKS;
  }
  return JSON.parse(stored);
}

export function saveBooks(books: Book[]): void {
  if (!isClient()) return;
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function getMembers(): Member[] {
  if (!isClient()) return MOCK_MEMBERS;
  const stored = localStorage.getItem(MEMBERS_KEY);
  if (!stored) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(MOCK_MEMBERS));
    return MOCK_MEMBERS;
  }
  return JSON.parse(stored);
}

export function saveMembers(members: Member[]): void {
  if (!isClient()) return;
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function getTransactions(): Transaction[] {
  if (!isClient()) return MOCK_TRANSACTIONS;
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  if (!stored) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(MOCK_TRANSACTIONS));
    return MOCK_TRANSACTIONS;
  }
  return JSON.parse(stored);
}

export function saveTransactions(transactions: Transaction[]): void {
  if (!isClient()) return;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addBook(book: Book): void {
  const books = getBooks();
  books.push(book);
  saveBooks(books);
}

export function updateBook(updated: Book): void {
  const books = getBooks();
  const idx = books.findIndex((b) => b.id === updated.id);
  if (idx !== -1) books[idx] = updated;
  saveBooks(books);
}

export function deleteBook(id: string): void {
  const books = getBooks().filter((b) => b.id !== id);
  saveBooks(books);
}

export function addMember(member: Member): void {
  const members = getMembers();
  members.push(member);
  saveMembers(members);
}

export function updateMember(updated: Member): void {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === updated.id);
  if (idx !== -1) members[idx] = updated;
  saveMembers(members);
}

export function deleteMember(id: string): void {
  const members = getMembers().filter((m) => m.id !== id);
  saveMembers(members);
}

export function addTransaction(tx: Transaction): void {
  const txs = getTransactions();
  txs.push(tx);
  saveTransactions(txs);
}

export function updateTransaction(updated: Transaction): void {
  const txs = getTransactions();
  const idx = txs.findIndex((t) => t.id === updated.id);
  if (idx !== -1) txs[idx] = updated;
  saveTransactions(txs);
}

export function generateId(prefix: string): string {
  return prefix + Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9);
}

export function calculateFine(dueDate: string, returnDate?: string): number {
  const due = new Date(dueDate);
  const ret = returnDate ? new Date(returnDate) : new Date();
  const diffMs = ret.getTime() - due.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 0;
  return diffDays * 1.0;
}

export function resetData(): void {
  if (!isClient()) return;
  localStorage.setItem(BOOKS_KEY, JSON.stringify(MOCK_BOOKS));
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(MOCK_MEMBERS));
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(MOCK_TRANSACTIONS));
}
