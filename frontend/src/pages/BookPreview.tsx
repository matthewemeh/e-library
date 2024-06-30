import { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { GiBookCover } from 'react-icons/gi';
import { SiPowerpages } from 'react-icons/si';
import { RiBookmarkFill } from 'react-icons/ri';
import { useParams, Link } from 'react-router-dom';
import { MdLocalLibrary, MdOutlineDateRange } from 'react-icons/md';

import { getDateProps, minifyViews } from 'utils';
import PageLayout from 'layouts/PageLayout';
import BookImage from 'components/BookImage';

import { useAppSelector } from 'hooks/useRootStorage';

const BookPreview = () => {
  const { id } = useParams();
  const { allBooks } = useAppSelector(state => state.bookStore);
  const {
    reads,
    pages,
    title,
    content,
    authors,
    updatedAt,
    bookmarks,
    coverImageUrl,
    imageContentUrls
  } = allBooks.find(({ _id }) => _id === id)!;
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const authorText = authors.length > 1 ? authors[0].concat(' et al') : authors[0];
  const { longMonthName, monthDate, year } = getDateProps(updatedAt);

  return (
    <PageLayout extraClassNames='bg-white rounded-md p-8 grid grid-cols-[60%_40%] dark:bg-nile-blue-900'>
      <div>
        <h1 className='text-[56px] leading-[64px] font-semibold pr-2'>{title}</h1>
        <p className='flex items-center gap-3 mt-4'>
          <FaUserAlt className='text-current' /> {authors.length > 0 ? authorText : 'None'}
        </p>
        <p className='flex items-center gap-3 mt-2'>
          <MdOutlineDateRange className='text-current text-[20px]' /> {longMonthName} {monthDate}
          ,&nbsp;{year}
        </p>
        <div className='flex items-center gap-4 mt-5'>
          <div className='flex flex-col gap-1 text-[14px] items-center justify-center pr-7'>
            <MdLocalLibrary className='text-current text-[30px]' />
            {minifyViews(reads)}
            {reads > 1000 && '+'} read{reads !== 1 && 's'}
          </div>
          <div className="flex flex-col gap-1 text-[14px] items-center justify-center px-7 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:content-[''] before:w-[1px] before:h-[45%] before:opacity-50 before:bg-nile-blue-900 before:dark:bg-zircon">
            <RiBookmarkFill className='text-current text-[30px]' />
            {minifyViews(bookmarks)}
            {bookmarks > 1000 && '+'} bookmark{bookmarks !== 1 && 's'}
          </div>
          {pages > 0 && (
            <div className="flex flex-col gap-1 text-[14px] items-center justify-center px-7 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:content-[''] before:w-[1px] before:h-[45%] before:opacity-50 before:bg-nile-blue-900 before:dark:bg-zircon">
              <SiPowerpages className='text-current text-[30px]' />
              {pages} pages
            </div>
          )}
        </div>

        <Link
          to={`/books/${id}/read`}
          className='bg-nile-blue-900 text-zircon py-2 px-8 w-[180px] h-12 grid place-items-center text-xl rounded-md my-7 border border-transparent font-semibold duration-300 dark:bg-zircon dark:text-nile-blue-900 hover:bg-transparent hover:text-nile-blue-900 hover:dark:text-zircon hover:border-current'>
          Read
        </Link>

        {content && (
          <p className='mb-4'>
            {content.slice(0, 1000)}
            {content.length > 1000 && '...'}
          </p>
        )}
        {imageContentUrls.length > 0 && (
          <div className='mr-5 flex gap-3 h-[120px] flex-wrap'>
            {imageContentUrls.slice(0, 5).map((imageUrl, index) => (
              <BookImage key={index} imageUrl={imageUrl} />
            ))}
          </div>
        )}
        {!content && imageContentUrls.length === 0 && (
          <p className='text-xl'>No preview content available</p>
        )}
      </div>

      <div
        className={`relative shadow h-full rounded-md overflow-hidden border-current ${
          imageLoaded || 'border-4'
        }`}>
        {imageLoaded || (
          <GiBookCover className='w-full h-3/5 absolute z-[1] top-1/2 -translate-y-1/2 left-0' />
        )}
        <img
          alt=''
          loading='lazy'
          src={coverImageUrl}
          onLoad={() => setImageLoaded(true)}
          className={`h-full ${imageLoaded || 'opacity-0 invisible'}`}
        />
      </div>
    </PageLayout>
  );
};

export default BookPreview;
