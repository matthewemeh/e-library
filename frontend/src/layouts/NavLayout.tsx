import { Outlet } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import axios from 'services/axios';
import Endpoints from 'services/Endpoints';
import { useAppDispatch } from 'hooks/useRootStorage';
import { updateBooks } from 'services/bookApi/bookSlice';

import Loading from 'components/Loading';
import Searchbar from 'components/Searchbar';
import Navigation from 'components/Navigation';

import { showAlert } from 'utils';

const NavLayout = () => {
  const { BOOKS } = Endpoints;
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(BOOKS)
      .then((res: AxiosResponse) => {
        const books: Book[] = res.data;
        dispatch(updateBooks(books));
      })
      .catch((err: AxiosError) => {
        showAlert({ msg: 'An error occured fetching books' });
        console.log(err.message);
      });
  }, []);

  return (
    <div className='h-screen grid grid-cols-[15%_85%] grid-rows-[12%_88%]'>
      <Navigation />
      <Searchbar />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default NavLayout;
