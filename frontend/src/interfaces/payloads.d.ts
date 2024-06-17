interface UserRegisterPayload {
  role: Role;
  name: string;
  email: string;
  password: string;
  profileImage: File;
}

interface UserLoginPayload {
  email: string;
  password: string;
}

interface AddBookPayload {
  pages: number;
  title: string;
  userRole: Role;
  content: string;
  authors: string[];
  imageContents: File[];
}

interface UpdateBookPayload {
  _id: string;
  reads?: number;
  pages?: number;
  title?: string;
  userRole?: Role;
  content?: string;
  category?: string;
  bookmarks?: number;
  authors?: string[];
  isDeleted?: boolean;
  imageContents?: File[];
}
