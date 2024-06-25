interface User {
  role: Role;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailValidated: boolean;
  profileImageUrl: string;
}

interface Book {
  _id: string;
  reads: number;
  pages: number;
  title: string;
  content: string;
  category: string;
  bookmarks: number;
  updatedAt: string;
  createdAt: string;
  authors: string[];
  coverImageUrl: string;
  imageContentUrls: string[];
}

interface BookReadInfo {
  bookID: string;
  lastOpened: string;
  percentRead: number;
}

interface UserData {
  isOtpVerified: boolean;
  isAuthenticated: boolean;
  prefersDarkMode: boolean;
  bookmarkedBookIDs: string[];
  booksReadInfo: BookReadInfo[];
  previouslyBookmarkedBookIDs: string[];
}

interface PaginatedResponse {
  docs: any[];
  page: number;
  total: number;
  limit: number;
  pages: number;
}

interface BookStore {
  pages: number;
  allBooks: Book[];
  paginatedBooks: Book[];
}

interface OtpDetails {
  otp: string;
  encryptedOtp: string;
}

interface StoredOtpDetails {
  otp: string;
  expiresAt: number;
}
