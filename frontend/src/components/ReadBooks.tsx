import BookReadInfo from './BookReadInfo';

import { useAppSelector } from 'hooks/useRootStorage';

const ReadBooks = () => {
  const { allBooks } = useAppSelector(state => state.bookStore);
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { booksRead = [] } = useAppSelector(state => state.userStore.currentUser);

  return booksRead.length > 0 ? (
    <section
      className={`mb-7 flex flex-col gap-2 bg-swan-white p-8 rounded-lg ${
        prefersDarkMode && 'dark:bg-nile-blue-900'
      }`}>
      <h2 className='font-bold text-2xl mb-5'>Continue your reading</h2>

      {[...booksRead]
        .sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime())
        .filter(({ bookID }) => {
          const bookIndex: number = allBooks.findIndex(({ _id }) => _id === bookID);
          return bookIndex > -1;
        })
        .map(bookReadInfo => {
          const { bookID }: BookReadInfo = bookReadInfo;
          const bookIndex: number = allBooks.findIndex(({ _id }) => _id === bookID);
          const { coverImageUrl, pages, title }: Book = allBooks[bookIndex] ?? {};

          return (
            <BookReadInfo
              key={bookID}
              pages={pages}
              title={title}
              bookReadInfo={bookReadInfo}
              coverImageUrl={coverImageUrl}
            />
          );
        })}
    </section>
  ) : null;
};

export default ReadBooks;
