interface User {
  role: Role;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailValidated: boolean;
  profileImageUrl: string;
  booksRead: BookReadInfo[];
  bookmarkedBookIDs: string[];
}

interface Book {
  _id: string;
  reads: number;
  pages: number;
  title: string;
  isPDF: boolean;
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

interface UserStore {
  pages: number;
  allUsers: User[];
  currentUser: User;
  paginatedUsers: User[];
}

interface OtpDetails {
  otp: string;
  encryptedOtp: string;
}

interface StoredOtpDetails {
  otp: string;
  expiresAt: number;
}

interface DayDetail {
  name: DayLongName;
  shortName: DayShortName;
}

interface MonthDetail {
  name: MonthLongName;
  shortName: MonthShortName;
}

interface DateProps {
  year: number;
  month: number;
  hour12: number;
  hour24: number;
  minutes: number;
  seconds: number;
  dayOfWeek: number;
  monthDate: number;
  milliseconds: number;
  am_or_pm: 'am' | 'pm';
  longDayOfWeek: DayLongName;
  shortDayOfWeek: DayShortName;
  longMonthName: MonthLongName;
  shortMonthName: MonthShortName;
  millisecondsFromInception: number;
}
