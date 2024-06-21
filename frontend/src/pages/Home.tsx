import { useMemo, useState } from 'react';
import PageLayout from 'layouts/PageLayout';
import { useAppSelector } from 'hooks/useRootStorage';

import Book from 'components/Book';
import SortButton from 'components/SortButton';

type SortQuery = 'popular' | 'new' | 'bookmarks' | 'pages';

const Home = () => {
  const [sortQuery, setSortQuery] = useState<SortQuery>();
  const books = useAppSelector(state => state.books);
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
    <div className='bg-white rounded-md p-8 dark:dark:bg-nile-blue-900'>
      <section>
        <header className='flex items-center gap-3'>
          <SortButton name='Popular' onClick={() => setSortQuery('popular')} />
          <SortButton name='Latest' onClick={() => setSortQuery('new')} />
          <SortButton name='Bookmarks' onClick={() => setSortQuery('bookmarks')} />
          <SortButton name='Pages' onClick={() => setSortQuery('pages')} />
        </header>
        <div className='mt-7 grid grid-cols-[repeat(auto-fit,minmax(200px,210px))] gap-3'>
          {sortedBooks.map(book => (
            <Book key={book._id} book={book} />
          ))}
        </div>
      </section>
      <section className='flex flex-col gap-2'></section>
    </div>
  );
};

export default Home;
