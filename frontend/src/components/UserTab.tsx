import { useState, useEffect } from 'react';
import { RiUser3Line } from 'react-icons/ri';

import Dropdown from './Dropdown';
import Constants from '../Constants';

import { getDateProps, showAlert } from 'utils';
import { useAppSelector } from 'hooks/useRootStorage';
import { useUpdateUserMutation } from 'services/apis/userApi/userStoreApi';

interface Props {
  user: User;
}

const UserTab: React.FC<Props> = ({ user }) => {
  const { ROLES } = Constants;
  const { name, role, profileImageUrl, createdAt, _id } = user;
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);

  const [newRole, setNewRole] = useState<string>(role);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const { longMonthName, monthDate, year } = getDateProps(createdAt);
  const [updateUser, { error, isError, isSuccess }] = useUpdateUserMutation();

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? ''}` });
      console.error(error);
    }
  }, [error, isError]);

  useEffect(() => {
    if (isSuccess) showAlert({ msg: 'Role update successful' });
  }, [isSuccess]);

  useEffect(() => {
    if (newRole !== role) updateUser({ _id, userID, role: newRole as Role });
  }, [newRole]);

  return (
    <div className='grid grid-cols-4 mb-3 bg-zircon p-4 rounded-md items-center last:mb-0 dark:bg-nile-blue-950'>
      <div className='block relative w-10 h-10 bg-zircon rounded-half cursor-pointer'>
        <img
          alt=''
          loading='lazy'
          src={profileImageUrl}
          onLoad={() => setImageLoaded(true)}
          className='w-full h-full rounded-half'
        />
        {imageLoaded || (
          <RiUser3Line className='absolute p-2 top-0 left-0 w-full h-full text-current' />
        )}
      </div>
      <p>{name}</p>
      <p>
        Joined {longMonthName} {monthDate}, {year}
      </p>
      <Dropdown
        selectedValue={newRole}
        setSelectedItem={setNewRole}
        extraDropdownButtonClassNames='mx-auto'
        list={Object.values(ROLES).filter(role => role !== ROLES.SUPER_ADMIN)}
      />
    </div>
  );
};

export default UserTab;
