import { isDevMode } from 'helpers/devDetect';

export default {
  EMAIL: '/email',
  USERS: '/users',
  BOOKS: '/books',
  LOGIN: '/users/login',
  GET_USERS: '/users/fetch',
  EMAIL_SEND: '/email/send',
  REGISTER: '/users/register',
  INCREASE_READS: '/books/increase-reads',
  INCREASE_BOOKMARKS: '/books/increase-bookmarks',
  DELETE_PROFILE_IMAGE: '/users/delete-profile-image',
  BASE_URL: isDevMode() ? 'http://localhost:8080' : process.env.REACT_APP_BACKEND_URL
};
