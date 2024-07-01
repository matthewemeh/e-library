import { GiBookCover } from 'react-icons/gi';
import { useContext, useMemo, useState } from 'react';

import Book from './Book';
import Loading from './Loading';
import SortButton from './SortButton';
import PaginationControls from './PaginationControls';

import { NavLayoutContext } from 'layouts/NavLayout';
import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  paginated?: boolean;
  showFilters?: boolean;
  emptyBookComponent?: JSX.Element;
  filterPredicate?: (book: Book) => boolean;
}

const BooksPanel: React.FC<Props> = ({
  paginated,
  showFilters,
  emptyBookComponent,
  filterPredicate = () => true
}) => {
  const [sortQuery, setSortQuery] = useState<SortQuery>();
  const { paginatedBooks, pages, allBooks } = useAppSelector(state => state.bookStore);
  const { page, setPage, isLoading, limit, MIN_PAGE_INDEX } = useContext(NavLayoutContext);

  const sortedBooks = useMemo<Book[]>(() => {
    const newBooks: Book[] = paginated && !sortQuery ? [...paginatedBooks] : [...allBooks];
    switch (sortQuery) {
      case 'popular':
        newBooks.sort((a, b) => b.reads - a.reads);
        break;
      case 'new':
        newBooks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'bookmarks':
        newBooks.sort((a, b) => b.bookmarks - a.bookmarks);
        break;
      case 'pages':
        newBooks.sort((a, b) => b.pages - a.pages);
        break;
    }
    if (sortQuery) {
      return newBooks.filter(filterPredicate).slice((page! - 1) * limit!, page! * limit!);
    }
    return newBooks.filter(filterPredicate);
  }, [paginatedBooks, sortQuery, paginated, filterPredicate, page, limit]);

  const handleSort = (newSort: SortQuery) => {
    setSortQuery(newSort);
  };

  return (
    <section className='bg-white p-8 rounded-lg dark:bg-nile-blue-900'>
      {sortedBooks.length > 0 && (
        <header className='flex mb-7 items-center justify-between gap-3'>
          {showFilters && (
            <div className='flex items-center gap-3'>
              <SortButton name='Popular' onClick={() => handleSort('popular')} />
              <SortButton name='Latest' onClick={() => handleSort('new')} />
              <SortButton name='Bookmarks' onClick={() => handleSort('bookmarks')} />
              <SortButton name='Pages' onClick={() => handleSort('pages')} />
            </div>
          )}
          {pages > 0 && paginated && (
            <PaginationControls page={page!} pages={pages} setPage={setPage!} />
          )}
        </header>
      )}
      <div
        className={`gap-x-3 gap-y-4 ${
          isLoading || sortedBooks.length === 0
            ? 'flex items-center justify-center'
            : 'grid grid-cols-[repeat(auto-fit,minmax(190px,200px))]'
        }`}>
        {isLoading ? (
          <Loading />
        ) : sortedBooks.length > 0 ? (
          sortedBooks.map(book => <Book key={book._id} book={book} />)
        ) : (
          <>
            {emptyBookComponent ?? (
              <div className='flex flex-col gap-5 items-center justify-center text-center'>
                <GiBookCover className='w-[100px] h-[100px]' />
                <span className='text-lg font-medium'>No Books here. Check again later</span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BooksPanel;
