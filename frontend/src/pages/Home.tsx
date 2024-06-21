import { useContext, useMemo, useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

import Book from 'components/Book';
import Loading from 'components/Loading';
import PageLayout from 'layouts/PageLayout';
import SortButton from 'components/SortButton';
import { NavLayoutContext } from 'layouts/NavLayout';
import { useAppSelector } from 'hooks/useRootStorage';

const Home = () => {
  const { page, setPage, MIN_PAGE_INDEX, isLoading } = useContext(NavLayoutContext);
  const { books, pages } = useAppSelector(state => state.bookStore);
  const [sortQuery, setSortQuery] = useState<SortQuery>();
  const sortedBooks = useMemo<Book[]>(() => {
    const newBooks: Book[] = [...books];
    switch (sortQuery) {
      case 'popular':
        return newBooks.sort((a, b) => b.reads - a.reads);
      case 'new':
        return newBooks.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case 'bookmarks':
        return newBooks.sort((a, b) => b.bookmarks - a.bookmarks);
      case 'pages':
        return newBooks.sort((a, b) => b.pages - a.pages);
      default:
        return newBooks;
    }
  }, [books, sortQuery]);

  return (
    <PageLayout>
      <section>
        <header className='flex items-center gap-3'>
          <SortButton name='Popular' onClick={() => setSortQuery('popular')} />
          <SortButton name='Latest' onClick={() => setSortQuery('new')} />
          <SortButton name='Bookmarks' onClick={() => setSortQuery('bookmarks')} />
          <SortButton name='Pages' onClick={() => setSortQuery('pages')} />
          {pages > 0 && (
            <div className='ml-auto flex items-center gap-7'>
              <button
                disabled={page! === MIN_PAGE_INDEX!}
                onClick={() => setPage!(prev => prev - 1)}
                className='flex items-center justify-between gap-3 bg-nile-blue-900 text-zircon rounded-3xl py-2 px-4 ease-in-out duration-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zircon dark:text-nile-blue-900'>
                <FaArrowLeft />
                Previous
              </button>
              <button
                disabled={page! === pages}
                onClick={() => setPage!(prev => prev + 1)}
                className='flex items-center justify-between gap-3 bg-nile-blue-900 text-zircon rounded-3xl py-2 px-4 ease-in-out duration-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zircon dark:text-nile-blue-900'>
                Next
                <FaArrowRight />
              </button>
            </div>
          )}
        </header>
        <div className='mt-7 grid grid-cols-[repeat(auto-fit,minmax(190px,200px))] gap-x-3 gap-y-4'>
          {isLoading! ? <Loading /> : sortedBooks?.map(book => <Book key={book._id} book={book} />)}
        </div>
      </section>
      <section className='flex flex-col gap-2'></section>
    </PageLayout>
  );
};

export default Home;
