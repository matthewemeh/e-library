interface PaginationContext {
  page: number;
  limit: number;
  isLoading: boolean;
  MIN_PAGE_INDEX: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

interface NavLayoutContext extends PaginationContext {
  contentRef: React.RefObject<HTMLDivElement>;
}

interface AppContext {
  prefersDarkMode: boolean;
}

interface AuthContext {
  mailSubject: string;
  mailPretext: string;
  OTP_DETAILS_KEY: string;
  onOtpValidated: () => void;
}
