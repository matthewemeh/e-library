import { lazy, useMemo } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import routes from 'routes';
import Page404 from 'pages/Page404';
import useAuth from 'hooks/useAuth';
import NavLayout from 'layouts/NavLayout';
import { PATHS } from 'routes/PathConstants';

const Admin = lazy(() => import('pages/Admin'));

const App = () => {
  const { ADMIN } = PATHS;
  const isAuthorized: boolean = useAuth();
  const newRoutes = useMemo<RouteObject[]>(() => {
    if (isAuthorized) {
      return [...routes, { path: ADMIN, element: <Admin /> }];
    }
    return routes;
  }, [isAuthorized, routes]);

  const router = createBrowserRouter([
    {
      element: <NavLayout />,
      errorElement: <Page404 />,
      children: newRoutes
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
