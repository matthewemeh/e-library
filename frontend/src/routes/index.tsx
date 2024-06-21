import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';

const { BOOKMARKS, HELP, HOME, SETTINGS, BOOKS, BOOK, BOOK_READ, PROFILE } = PATHS;

const Home = lazy(() => import('pages/Home'));
const Help = lazy(() => import('pages/Help'));
const Books = lazy(() => import('pages/Books'));
const Profile = lazy(() => import('pages/Profile'));
const BookRead = lazy(() => import('pages/BookRead'));
const Settings = lazy(() => import('pages/Settings'));
const Bookmarks = lazy(() => import('pages/Bookmarks'));
const BookPreview = lazy(() => import('pages/BookPreview'));

const routes: RouteObject[] = [
  { path: HOME, index: true, element: <Home /> },
  { path: BOOKMARKS, element: <Bookmarks /> },
  { path: BOOK_READ, element: <BookRead /> },
  { path: SETTINGS, element: <Settings /> },
  { path: BOOK, element: <BookPreview /> },
  { path: PROFILE, element: <Profile /> },
  { path: BOOKS, element: <Books /> },
  { path: HELP, element: <Help /> }
];

export default routes;
