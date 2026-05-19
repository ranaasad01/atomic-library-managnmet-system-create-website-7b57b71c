export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverImage?: string;
  addedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipId: string;
  joinedAt: string;
  status: "active" | "suspended" | "expired";
  totalBorrowed: number;
  currentlyBorrowed: number;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  bookTitle: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
  fine: number;
  finePaid: boolean;
}

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  issuedBooks: number;
  overdueBooks: number;
  totalFines: number;
  availableBooks: number;
}
