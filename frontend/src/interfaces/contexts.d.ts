interface NavLayoutContext {
  page: number;
  limit: number;
  isLoading: boolean;
  MIN_PAGE_INDEX: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}
