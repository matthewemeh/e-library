import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiBookCover } from 'react-icons/gi';

interface Props {
  book: Book;
}

const Book: React.FC<Props> = ({ book }) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const { _id, coverImageUrl, title, authors } = book;
  const authorText = authors.length > 1 ? authors[0].concat(' et al') : authors[0];

  return (
    <Link
      to={`/books/${_id}`}
      className='relative bg-white rounded-md overflow-clip shadow-lg w-[200px] h-[250px] grid grid-rows-[70%_12%_12%] gap-1 dark:bg-nile-blue-950 ease-linear duration-200 hover:scale-105'>
      {imageLoaded || <GiBookCover className='w-full h-3/5 absolute z-[1] top-5 left-0' />}
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
    </Link>
  );
};

export default Book;
