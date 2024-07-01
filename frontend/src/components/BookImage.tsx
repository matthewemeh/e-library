import { useState } from 'react';
import { MdImage } from 'react-icons/md';

interface Props {
  imageUrl: string;
  extraClassNames?: string;
}

const BookImage: React.FC<Props> = ({ extraClassNames, imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <div
      className={`relative shadow w-[85px] h-full rounded shrink-0 overflow-hidden border-current ${
        imageLoaded || ''
      } ${extraClassNames}`}>
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
