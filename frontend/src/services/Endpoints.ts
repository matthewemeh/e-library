import { isDevMode } from 'helpers/devDetect';

const Endpoints = {
  USERS: '/users',
  BOOKS: '/books',
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  INCREASE_READS: '/books/increase-reads',
  INCREASE_BOOKMARKS: '/books/increase-bookmarks',
  BASE_URL: isDevMode() ? 'http://localhost:8080' : process.env.REACT_APP_BACKEND_URL
};

export default Endpoints;
