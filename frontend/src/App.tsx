import { lazy, useEffect, useMemo } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import routes from 'routes';
import Page404 from 'pages/Page404';
import useAuth from 'hooks/useAuth';
import authRoutes from 'routes/auth';
import NavLayout from 'layouts/NavLayout';
import AuthLayout from 'layouts/AuthLayout';
import { PATHS } from 'routes/PathConstants';
import { updateUserData } from 'services/userData/userDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';

const Admin = lazy(() => import('pages/admin/Admin'));
const AddBook = lazy(() => import('pages/admin/AddBook'));
const EditBook = lazy(() => import('pages/admin/EditBook'));
const ManageBooks = lazy(() => import('pages/admin/ManageBooks'));
const ManageUsers = lazy(() => import('pages/admin/ManageUsers'));

const App = () => {
  const { ADMIN, ADMIN_BOOKS, ADMIN_USERS, EDIT_BOOK, NEW_BOOK } = PATHS;

  const dispatch = useAppDispatch();
  const isAuthorized: boolean = useAuth();
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const newRoutes = useMemo<RouteObject[]>(() => {
    if (isAuthorized) {
      return [
        ...routes,
        { path: ADMIN, element: <Admin /> },
        { path: NEW_BOOK, element: <AddBook /> },
        { path: EDIT_BOOK, element: <EditBook /> },
        { path: ADMIN_BOOKS, element: <ManageBooks /> },
        { path: ADMIN_USERS, element: <ManageUsers /> }
      ];
    }
    return routes;
  }, [isAuthorized, routes]);

  useEffect(() => {
    const windowMatchMedia: MediaQueryList = window.matchMedia?.('(prefers-color-scheme: dark)');
    const isDarkMode: boolean = windowMatchMedia.matches;
    dispatch(updateUserData({ prefersDarkMode: isDarkMode }));

    windowMatchMedia.addEventListener('change', event => {
      dispatch(updateUserData({ prefersDarkMode: event.matches }));
    });

    return () => {
      windowMatchMedia.removeEventListener('change', event => {
        dispatch(updateUserData({ prefersDarkMode: event.matches }));
      });
    };
  }, []);

  const router = createBrowserRouter([
    {
      element: <NavLayout />,
      errorElement: <Page404 />,
      children: newRoutes
    },
    {
      element: <AuthLayout />,
      errorElement: <Page404 />,
      children: authRoutes
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
