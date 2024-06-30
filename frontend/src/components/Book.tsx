import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { GiBookCover } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import { showAlert } from 'utils';
import { useAppSelector } from 'hooks/useRootStorage';
import { useDeleteBookMutation } from 'services/apis/bookApi/bookStoreApi';

interface Props {
  book: Book;
  isAdminMode?: boolean;
}

const Book: React.FC<Props> = ({ book, isAdminMode }) => {
  const navigate = useNavigate();
  const { _id, coverImageUrl, title, authors } = book;
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const authorText = authors.length > 1 ? authors[0].concat(' et al') : authors[0];
  const [deleteBook, { error, isError, isSuccess, isLoading }] = useDeleteBookMutation();

  const handleDeleteBook = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isDeleteConfirmed: boolean = window.confirm(`Are you sure you want to delete ${title}?`);
    if (isDeleteConfirmed) deleteBook({ _id, userID });
    e.stopPropagation();
  };

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? 'An error occured while deleting'}` });
      console.error(error);
    }
  }, [error, isError]);

  useEffect(() => {
    if (isSuccess) showAlert({ msg: 'Book deleted successfully' });
  }, [isSuccess]);

  return (
    <div
      onClick={() => navigate(`${isAdminMode ? '/admin' : ''}/books/${_id}`)}
      className='relative cursor-pointer bg-white rounded-md overflow-clip shadow-lg w-[190px] h-[250px] grid grid-rows-[70%_12%_12%] gap-0.5 dark:bg-nile-blue-950 ease-linear duration-200 hover:scale-105'>
      {imageLoaded || <GiBookCover className='w-full h-3/5 absolute z-[1] top-5 left-0' />}
      {isAdminMode && (
        <button
          onClick={handleDeleteBook}
          className={`absolute z-[2] w-[26px] h-[26px] right-3 top-2 text-red-600 rounded-half shadow-sm ${
            isLoading && 'opacity-0 invisible'
          }`}>
          <MdDelete
            className={`w-full h-full text-red-600 ${isLoading && 'opacity-0 invisible'}`}
          />
        </button>
      )}
      <img
        alt=''
        src={coverImageUrl}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full rounded ${imageLoaded || 'opacity-0 invisible'}`}
      />
      <p className='px-3 whitespace-nowrap overflow-hidden text-ellipsis font-medium'>{title}</p>
      <p className='px-3 whitespace-nowrap overflow-hidden text-ellipsis'>
        {authors.length > 0 ? authorText : ''}
      </p>
    </div>
  );
};

export default Book;
