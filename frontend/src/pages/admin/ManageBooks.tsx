import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GiBookCover } from 'react-icons/gi';
import { IoMdAddCircle } from 'react-icons/io';

import Book from 'components/Book';
import Loading from 'components/Loading';
import PageLayout from 'layouts/PageLayout';
import PaginationControls from 'components/PaginationControls';

import { showAlert } from 'utils';
import { PATHS } from 'routes/PathConstants';
import { useAppSelector } from 'hooks/useRootStorage';
import { useGetBooksMutation } from 'services/apis/bookApi/bookStoreApi';

const ManageBooks = () => {
  const MIN_PAGE_INDEX = 1;
  const { NEW_BOOK } = PATHS;

  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { allBooks, paginatedBooks, pages } = useAppSelector(state => state.bookStore);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const [getBooks, { error, isError, isLoading }] = useGetBooksMutation();

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  useEffect(() => {
    getBooks({ params: { page, limit } }); // updates `paginatedBooks` and `pages` in state
  }, [page]);

  useEffect(() => {
    getBooks({}); // updates `allBooks` in state
  }, []);

  useEffect(() => {
    if (isError) {
      setPage(MIN_PAGE_INDEX);
      console.log(error);
      showAlert({
        msg: 'Could not fetch latest books. Please check your internet connection and try again'
      });
    }
  }, [error, isError]);

  useEffect(() => {
    if (paginatedBooks.length === 0 && page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page, paginatedBooks]);

  return (
    <PageLayout>
      <div className={`bg-swan-white p-8 rounded-lg ${prefersDarkMode && 'dark:bg-nile-blue-900'}`}>
        <h1 className='text-3xl font-bold mb-2'>
          Manage Books
          <Link
            className='flex items-center justify-center w-max gap-1 text-base font-normal border border-current rounded-3xl px-4 py-2 mt-3'
            to={NEW_BOOK}>
            Add a new Book <IoMdAddCircle />
          </Link>
        </h1>
        {allBooks.length > 0 && <PaginationControls page={page} pages={pages} setPage={setPage} />}

        <div
          className={`gap-x-3 gap-y-4 ${
            isLoading || paginatedBooks.length === 0
              ? 'flex items-center justify-center'
              : 'grid grid-cols-[repeat(auto-fit,minmax(190px,200px))]'
          }`}>
          {isLoading ? (
            <Loading />
          ) : allBooks.length > 0 ? (
            paginatedBooks.map(book => <Book isAdminMode key={book._id} book={book} />)
          ) : (
            <div className='flex flex-col gap-5 items-center justify-center text-center'>
              <GiBookCover className='w-[100px] h-[100px]' />
              <span className='text-lg font-medium'>No Books here. Check again later</span>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ManageBooks;
