import BookReadInfo from './BookReadInfo';

import { useAppSelector } from 'hooks/useRootStorage';

const ReadBooks = () => {
  const { allBooks }: BookStore = useAppSelector(state => state.bookStore);
  const { booksReadInfo }: UserData = useAppSelector(state => state.userData);

  return booksReadInfo.length > 0 ? (
    <section className='mb-7 flex flex-col gap-2 bg-white p-8 rounded-lg dark:dark:bg-nile-blue-900'>
      <h2 className='font-bold text-2xl mb-5'>Continue your reading</h2>

      {booksReadInfo
        .sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime())
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
              isDeleted={bookIndex === -1}
              coverImageUrl={coverImageUrl}
            />
          );
        })}
    </section>
  ) : null;
};

export default ReadBooks;
