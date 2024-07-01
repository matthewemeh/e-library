import { Outlet, useNavigate } from 'react-router-dom';
import { Suspense, useCallback, useEffect, useRef, useState, createContext } from 'react';

import Loading from 'components/Loading';
import Searchbar from 'components/Searchbar';
import Navigation from 'components/Navigation';

import { showAlert } from 'utils';
import { PATHS } from 'routes/PathConstants';
import { useAppSelector } from 'hooks/useRootStorage';
import { useGetBooksMutation } from 'services/apis/bookApi/bookStoreApi';

export const NavLayoutContext = createContext<Partial<NavLayoutContext>>({});

const NavLayout = () => {
  const MIN_PAGE_INDEX = 1;
  const navigate = useNavigate();
  const { LOGIN, VERIFY_OTP } = PATHS;
  const [limit, setLimit] = useState<number>(10);
  const contentRef = useRef<HTMLDivElement>(null);
  const [transparent, setTransparent] = useState(true);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);

  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { paginatedBooks } = useAppSelector(state => state.bookStore);
  const [getBooks, { error, isError, isLoading }] = useGetBooksMutation();
  const { emailValidated } = useAppSelector(state => state.userStore.currentUser);

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  useEffect(() => {
    getBooks({ params: { page, limit } }); // updates `paginatedBooks` and `pages` in state
  }, [page]);

  useEffect(() => {
    getBooks({}); // updates `allBooks` in state
  }, []);

  useEffect(() => {
    if (paginatedBooks.length === 0 && page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page, paginatedBooks]);

  const watchContentScroll = useCallback(() => {
    const scrollYPos = contentRef.current!.scrollTop;
    if (scrollYPos >= 10) setTransparent(false);
    else if (scrollYPos < 10) setTransparent(true);
  }, [transparent]);

  useEffect(() => {
    contentRef.current!.addEventListener('scroll', watchContentScroll);

    return () => {
      contentRef.current!.removeEventListener('scroll', watchContentScroll);
    };
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
    if (!isAuthenticated) navigate(LOGIN);
    else if (!emailValidated) navigate(VERIFY_OTP);
  }, [emailValidated, isAuthenticated]);

  return (
    <NavLayoutContext.Provider
      value={{ page, setPage, limit, setLimit, MIN_PAGE_INDEX, isLoading, contentRef }}>
      <main className='h-screen grid grid-cols-[15%_85%] grid-rows-[12%_88%]'>
        <Navigation />
        <Searchbar extraClassNames={`${transparent || 'z-[1] shadow-[5px_4px_5px_0px_#000]'}`} />
        <div ref={contentRef} className='overflow-y-auto p-4'>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </NavLayoutContext.Provider>
  );
};

export default NavLayout;
