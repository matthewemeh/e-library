import { useState } from 'react';
import { RiUser3Line } from 'react-icons/ri';

import Dropdown from './Dropdown';

interface Props {
  user: User;
}

const UserTab: React.FC<Props> = ({ user }) => {
  const { name, role, profileImageUrl, createdAt } = user;
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <div className='grid grid-cols-4'>
      <div className='block relative w-5 h-5 bg-zircon rounded-half cursor-pointer'>
        <img alt='' src={profileImageUrl} onLoad={() => setImageLoaded(true)} />
        {imageLoaded || (
          <RiUser3Line className='absolute p-2 top-0 left-0 w-full h-full text-current' />
        )}
      </div>
    </div>
  );
};

export default UserTab;
