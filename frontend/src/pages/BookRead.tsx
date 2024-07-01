import { FaUserAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { MdOutlineDateRange } from 'react-icons/md';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { RiBookmarkFill, RiBookmarkLine, RiFolderWarningLine } from 'react-icons/ri';

import { getDateProps } from 'utils';
import { useAppSelector } from 'hooks/useRootStorage';
import { useUpdateUserMutation } from 'services/apis/userApi/userStoreApi';
import {
  useIncreaseReadsMutation,
  useIncreaseBookmarksMutation
} from 'services/apis/bookApi/bookStoreApi';

import BookImage from 'components/BookImage';
import { NavLayoutContext } from 'layouts/NavLayout';

const BookRead = () => {
  const { id } = useParams();
  const { contentRef } = useContext(NavLayoutContext);
  const { allBooks } = useAppSelector(state => state.bookStore);
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const {
    booksRead,
    _id: userID,
    bookmarkedBookIDs
  } = useAppSelector(state => state.userStore.currentUser);
  const [pageProgress, setPageProgress] = useState<number>(
    booksRead.find(({ bookID }) => bookID === id)?.percentRead ?? 0
  );
  const [increaseReads, { isError: isReadsError, error: readsError, isSuccess: isReadsSuccess }] =
    useIncreaseReadsMutation();
  const [updateUser, { error: updateError, isError: isUpdateError }] = useUpdateUserMutation();

  const [
    increaseBookmarks,
    { isError: isBookmarkError, error: bookmarkError, isLoading: isBookmarkLoading }
  ] = useIncreaseBookmarksMutation();

  const { title, content, authors, imageContentUrls, createdAt } = allBooks.find(
    ({ _id }) => _id === id
  )!;
  const { longMonthName, monthDate, year } = getDateProps(createdAt);
  const authorText = authors.length > 1 ? authors[0].concat(' et al') : authors[0];

  const isBookmarked = useMemo<boolean>(() => bookmarkedBookIDs.includes(id!), [bookmarkedBookIDs]);

  const watchContentScroll = useCallback(() => {
    const contentElement: HTMLDivElement | null = contentRef!.current!;

    const newPageProgress: number =
      ((contentElement.scrollTop + 656) / contentElement.scrollHeight) * 100;
    if (newPageProgress > pageProgress) {
      if (newPageProgress > 100) setPageProgress(100);
      else setPageProgress(newPageProgress);
    }
  }, [pageProgress]);

  useEffect(() => {
    const contentElement: HTMLDivElement | null = contentRef!.current!;
    if (pageProgress > 0) {
      contentElement.scrollTo({
        behavior: 'smooth',
        top: pageProgress * contentElement.scrollHeight
      });
    }

    contentElement.addEventListener('scroll', watchContentScroll);

    return () => {
      contentElement.addEventListener('scroll', watchContentScroll);
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    if (Math.floor(pageProgress) % 4 === 0) {
      const bookAlreadyRead = booksRead.find(({ bookID }) => bookID === id);
      if (bookAlreadyRead) {
        updateUser({
          userID,
          _id: userID,
          bookRead: { ...bookAlreadyRead, percentRead: Math.floor(pageProgress) }
        });
      } else {
        updateUser({
          userID,
          _id: userID,
          bookRead: { bookID: id, percentRead: Math.floor(pageProgress) }
        });
      }
    }
  }, [pageProgress]);

  useEffect(() => {
    const bookAlreadyRead = booksRead.find(({ bookID }) => bookID === id);
    if (!id) return;

    if (bookAlreadyRead) {
      updateUser({
        userID,
        _id: userID,
        bookRead: { ...bookAlreadyRead, lastOpened: new Date().toISOString() }
      });
    } else {
      increaseReads({ _id: id });
      updateUser({ userID, _id: userID, bookRead: { bookID: id } });
    }
  }, [id]);

  useEffect(() => {
    if (id && isReadsSuccess) {
      updateUser({ userID, _id: userID, bookRead: { bookID: id } });
    }
  }, [isReadsSuccess]);

  useEffect(() => {
    if (isReadsError && readsError && 'status' in readsError) {
      console.error(readsError);
    }
  }, [readsError, isReadsError]);

  useEffect(() => {
    if (isBookmarkError && bookmarkError && 'status' in bookmarkError) {
      console.error(bookmarkError);
    }
  }, [bookmarkError, isBookmarkError]);

  useEffect(() => {
    if (isUpdateError && updateError && 'status' in updateError) {
      console.error(updateError);
    }
  }, [updateError, isUpdateError]);

  return (
    <article
      className={`bg-swan-white px-6 py-4 rounded-lg flex flex-col items-center justify-center mx-auto ${
        prefersDarkMode && 'dark:bg-nile-blue-900'
      }`}>
      <h1 className='text-[42px] leading-[52px] -tracking-[0.462px] font-bold'>{title}</h1>
      <div className='grid grid-cols-2 gap-y-1 gap-x-4 mt-4 mb-5'>
        <p className='flex items-center justify-center gap-3'>
          <FaUserAlt className='text-current' /> {authors.length > 0 ? authorText : 'None'}
        </p>
        <p className='flex items-center justify-center gap-3'>
          <MdOutlineDateRange className='text-current text-[20px]' /> {longMonthName} {monthDate}
          ,&nbsp;{year}
        </p>
        <button
          disabled={isBookmarkLoading}
          onClick={() => {
            if (id) {
              if (!bookmarkedBookIDs.includes(id)) increaseBookmarks({ _id: id });
              updateUser({ userID, _id: userID, bookmarkedBookID: id });
            }
          }}
          className='col-start-1 col-end-3 text-center flex items-center justify-center gap-2 disabled:opacity-50 underline'>
          {isBookmarked ? <RiBookmarkFill /> : <RiBookmarkLine />}
          Bookmark this book
        </button>
      </div>
      {content && (
        <p className='mb-10 text-left break-all w-full mr-auto text-xl tracking-normal first-letter:font-bold first-letter:text-7xl'>
          {content}
        </p>
      )}
      {imageContentUrls.length > 0 && (
        <div className='mb-5 flex flex-col items-center gap-5 flex-wrap'>
          {imageContentUrls.map((imageUrl, index) => (
            <BookImage key={index} imageUrl={imageUrl} extraClassNames='!w-3/4 !h-fit' />
          ))}
        </div>
      )}
      {!content && imageContentUrls.length === 0 && (
        <p className='text-xl mt-3 flex items-center justify-center gap-2'>
          <RiFolderWarningLine className='text-[25px]' /> No content is available for this book
        </p>
      )}
    </article>
  );
};

export default BookRead;
