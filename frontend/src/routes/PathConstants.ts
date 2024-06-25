export const PATHS = {
  HOME: '/',
  HELP: '/help',
  LOGIN: '/auth',
  ADMIN: '/admin',
  BOOKS: '/books',
  BOOK: '/books/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  BOOKMARKS: '/bookmarks',
  REGISTER: '/auth/register',
  BOOK_READ: '/books/:id/read',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
  FORGOT_PASSWORD: '/auth/forgot-password'
} as const;
