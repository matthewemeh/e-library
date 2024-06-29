import { useEffect, useState } from 'react';

import UserTab from 'components/UserTab';
import PageLayout from 'layouts/PageLayout';
import { useAppSelector } from 'hooks/useRootStorage';
import { showAlert } from 'utils';
import { useGetUsersMutation } from 'services/apis/userApi/userStoreApi';

const ManageUsers = () => {
  const MIN_PAGE_INDEX = 1;

  const { _id } = useAppSelector(state => state.userStore.currentUser);
  const { paginatedUsers } = useAppSelector(state => state.userStore);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const [getUsers, { error, isError, isLoading }] = useGetUsersMutation();

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  useEffect(() => {
    getUsers({ userID: _id, params: { page, limit } }); // updates `paginatedUsers` and `pages` in state
  }, [page]);

  useEffect(() => {
    if (isError) {
      setPage(MIN_PAGE_INDEX);
      console.log(error);
      showAlert({
        msg: 'Could not fetch latest books. Please check your internet connection and try again'
      });
    }
  }, [error, isError]);

  return (
    <PageLayout>
      <div className='bg-white p-8 rounded-lg dark:bg-nile-blue-900'>
        <h1 className='text-3xl font-bold'>Manage Users</h1>

        {paginatedUsers.map(user => (
          <UserTab user={user} />
        ))}
      </div>
    </PageLayout>
  );
};

export default ManageUsers;
