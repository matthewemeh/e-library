interface UserRegisterPayload {
  role?: Role;
  name: string;
  email: string;
  password: string;
  profileImage?: File;
}

interface UserUpdatePayload {
  _id: string;
  role?: Role;
  name?: string;
  userID: string;
  email?: string;
  password?: string;
  profileImage?: File;
  emailValidated?: boolean;
  bookmarkedBookID?: string;
  bookRead?: { bookID: string; lastOpened?: string; percentRead?: number };
}

interface UserLoginPayload {
  email: string;
  password: string;
}

interface AddBookPayload {
  title: string;
  pages?: number;
  userID: string;
  content?: string;
  authors?: string[];
  imageContents?: File[];
  coverImageContent?: File;
  params?: Record<string, any>;
}

interface UpdateBookPayload {
  _id: string;
  reads?: number;
  pages?: number;
  title?: string;
  userID: string;
  content?: string;
  category?: string;
  bookmarks?: number;
  authors?: string[];
  imageContents?: File[];
  coverImageContent?: File;
  params?: Record<string, any>;
}

interface DeleteBookPayload {
  _id: string;
  userID: string;
  params?: Record<string, any>;
}

interface GetUsersPayload {
  userID: string;
  params?: Record<string, any>;
}

interface GetUserPayload {
  _id: string;
  params?: Record<string, any>;
}

interface DeleteUserPayload {
  _id: string;
  userID: string;
}

interface GetBooksPayload {
  params?: Record<string, any>;
}

interface EmailSendPayload {
  to: string;
  text?: string;
  html?: string;
  subject?: string;
}
