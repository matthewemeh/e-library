import { useState } from 'react';
import { GiBookCover } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

import Progress from './Progress';

interface Props {
  pages: number;
  title: string;
  isDeleted?: boolean;
  coverImageUrl: string;
  bookReadInfo: BookReadInfo;
}

const BookReadInfo: React.FC<Props> = ({ title, pages, bookReadInfo, coverImageUrl }) => {
  const navigate = useNavigate();
  const { bookID, percentRead } = bookReadInfo;
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <button
      onClick={() => navigate(`/books/${bookID}/read`)}
      className='grid grid-cols-[25%_1fr_20%] gap-4 items-center justify-between px-6 py-1.5 border-2 border-transparent rounded-md shadow-md duration-300 ease-in-out hover:border-current bg-white text-nile-blue-900 dark:bg-nile-blue-950 dark:text-zircon disabled:opacity-50 disabled:cursor-not-allowed disabled:border-transparent'>
      <span className='flex items-center gap-4 relative'>
        {imageLoaded || <GiBookCover className='w-[60px] h-[70px] absolute z-[1] top-0 left-0' />}
        <img
          alt=''
          src={coverImageUrl}
          onLoad={() => setImageLoaded(true)}
          className={`w-[60px] h-[70px] rounded-md ${imageLoaded || 'opacity-0 invisible'}`}
        />
        <span className='overflow-hidden whitespace-nowrap text-ellipsis'>{title}</span>
      </span>

      <span className='flex items-center gap-3'>
        {pages > 0 && `${pages} page${pages > 1 ? 's' : ''}`}
        <Progress percentage={percentRead} />
      </span>

      <span className='text-right'>{percentRead}% complete</span>
    </button>
  );
};

export default BookReadInfo;
