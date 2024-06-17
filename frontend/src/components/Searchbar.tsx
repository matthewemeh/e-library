import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { RiMoonLine, RiSearch2Line, RiSunLine, RiUser3Line } from 'react-icons/ri';

import { PATHS } from 'routes/PathConstants';
import { useAppSelector } from 'hooks/useRootStorage';

const { PROFILE } = PATHS;

const Searchbar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, profileImageUrl } = useAppSelector(store => store.user);

  return (
    <div className='px-4 flex items-center justify-between gap-5 bg-white'>
      <div className='w-1/2 flex gap-2.5 items-center p-2.5 rounded-lg bg-zircon'>
        <RiSearch2Line />
        <input
          type='text'
          ref={searchInputRef}
          placeholder='Search'
          className='bg-transparent outline-none w-full placeholder:text-nile-blue-600'
        />
      </div>

      <button className='w-11 h-11 p-1 bg-zircon rounded-half ml-auto'>
        <RiMoonLine className='w-full h-full' />
      </button>
      <Link
        to={PROFILE}
        className={`block w-11 h-11 bg-zircon rounded-half ${isAuthenticated || 'p-1.5'}`}>
        {isAuthenticated ? (
          <img src={profileImageUrl} alt='' />
        ) : (
          <RiUser3Line className='w-full h-full' />
        )}
      </Link>
    </div>
  );
};

export default Searchbar;
