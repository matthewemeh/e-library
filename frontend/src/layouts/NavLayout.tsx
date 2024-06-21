import { Outlet } from 'react-router-dom';
import { Suspense, useEffect, useState, createContext } from 'react';

import Loading from 'components/Loading';
import Searchbar from 'components/Searchbar';
import Navigation from 'components/Navigation';

import { showAlert } from 'utils';
import { useGetBooksMutation } from 'services/apis/bookApi/bookStoreApi';

export const NavLayoutContext = createContext<Partial<NavLayoutContext>>({});

const NavLayout = () => {
  const MIN_PAGE_INDEX = 1;
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const [getBooks, { error, isError, isLoading }] = useGetBooksMutation();

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  useEffect(() => {
    getBooks({ params: { page, limit } });
  }, [page]);

  useEffect(() => {
    if (isError) {
      console.log(error);
      showAlert({
        msg: 'Could not fetch latest books. Please check your internet connection and try again'
      });
    }
  }, [error, isError]);

  return (
    <NavLayoutContext.Provider value={{ page, setPage, limit, setLimit, MIN_PAGE_INDEX }}>
      <div className='h-screen grid grid-cols-[15%_85%] grid-rows-[12%_88%]'>
        <Navigation />
        <Searchbar />
        <div className='overflow-y-auto p-4'>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </NavLayoutContext.Provider>
  );
};

export default NavLayout;
