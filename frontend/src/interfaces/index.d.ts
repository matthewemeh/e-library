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
  isDeleted: boolean;
  imageContentUrls: string[];
}

interface BookReadInfo {
  bookID: string;
  percentRead: number;
}

interface UserData {
  isAuthenticated: boolean;
  prefersDarkMode: boolean;
  bookmarkedBookIDs: string[];
  booksReadInfo: BookReadInfo[];
  previouslyBookmarkedBookIDs: string[];
}
