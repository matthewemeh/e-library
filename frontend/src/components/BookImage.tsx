import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdImage } from 'react-icons/md';

interface Props {
  isPDF?: boolean;
  imageUrl: string;
  bookTitle: string;
  extraClassNames?: string;
}

const BookImage: React.FC<Props> = ({ extraClassNames, imageUrl, isPDF, bookTitle }) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return isPDF ? (
    <Link to={imageUrl} className='underline' download>
      Download {bookTitle}.pdf
    </Link>
  ) : (
    <div
      className={`relative shadow w-[85px] h-full rounded shrink-0 overflow-hidden border-current ${extraClassNames}`}>
      {imageLoaded || (
        <MdImage className='bg-nile-blue-500 text-swan-white px-4 w-full h-full absolute z-[1] top-1/2 -translate-y-1/2 left-0 animate-pulse' />
      )}
      <img
        alt=''
        loading='lazy'
        src={imageUrl}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full ${imageLoaded || 'opacity-0 invisible'}`}
      />
    </div>
  );
};

export default BookImage;
