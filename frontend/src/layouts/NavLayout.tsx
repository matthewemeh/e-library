import { Outlet } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';

import Endpoints from 'services/Endpoints';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';

import Loading from 'components/Loading';
import Searchbar from 'components/Searchbar';
import Navigation from 'components/Navigation';

import { showAlert } from 'utils';
import { useGetBooksMutation } from 'services/apis/bookApi/bookApi';

const NavLayout = () => {
  const { BOOKS } = Endpoints;

  const limit = 10;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [getBooks, { error, isError, isLoading, isSuccess }] = useGetBooksMutation();

  useEffect(() => {
    getBooks({ params: { page, limit } });
  }, []);

  useEffect(() => {
    if (isError) {
      console.log(error);
      showAlert({
        msg: 'Could not fetch latest books. Please check your internet connection and try again'
      });
    }
  }, [error, isError]);

  return (
    <div className='h-screen grid grid-cols-[15%_85%] grid-rows-[12%_88%]'>
      <Navigation />
      <Searchbar />
      <div className='overflow-y-auto p-4'>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default NavLayout;
