import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';

const { BOOKMARKS, HELP, HOME, SETTINGS, BOOKS, BOOK, PROFILE } = PATHS;

const Home = lazy(() => import('pages/Home'));
const Help = lazy(() => import('pages/Help'));
const Book = lazy(() => import('pages/Book'));
const Books = lazy(() => import('pages/Books'));
const Profile = lazy(() => import('pages/Profile'));
const Settings = lazy(() => import('pages/Settings'));
const Bookmarks = lazy(() => import('pages/Bookmarks'));

const routes: RouteObject[] = [
  { path: HOME, index: true, element: <Home /> },
  { path: BOOKMARKS, element: <Bookmarks /> },
  { path: SETTINGS, element: <Settings /> },
  { path: PROFILE, element: <Profile /> },
  { path: BOOKS, element: <Books /> },
  { path: BOOK, element: <Book /> },
  { path: HELP, element: <Help /> }
];

export default routes;
