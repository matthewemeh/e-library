import { FaUserSlash } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';

import UserTab from 'components/UserTab';
import Loading from 'components/Loading';
import PageLayout from 'layouts/PageLayout';
import PaginationControls from 'components/PaginationControls';

import { useAppSelector } from 'hooks/useRootStorage';
import { useGetUsersMutation } from 'services/apis/userApi/userStoreApi';

import { showAlert } from 'utils';

const ManageUsers = () => {
  const MIN_PAGE_INDEX = 1;

  const { paginatedUsers, currentUser, pages } = useAppSelector(state => state.userStore);
  const { _id, role } = currentUser;

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const [getUsers, { error, isError, isLoading }] = useGetUsersMutation();

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  useEffect(() => {
    getUsers({ userID: _id, params: { page, limit } }); // updates `paginatedUsers` and `pages` in state
  }, [page]);

  useEffect(() => {
    getUsers({ userID: _id }); // updates `allUsers` in state
  }, []);

  useEffect(() => {
    if (isError) {
      setPage(MIN_PAGE_INDEX);
      console.log(error);
      showAlert({
        msg: 'Could not fetch latest books. Please check your internet connection and try again'
      });
    }
  }, [error, isError]);

  const users = useMemo<User[]>(() => {
    if (role === 'SUPER_ADMIN') {
      return paginatedUsers.filter(({ role }) => role !== 'SUPER_ADMIN');
    } else {
      return paginatedUsers.filter(({ role }) => role === 'USER');
    }
  }, [paginatedUsers, role]);

  return (
    <PageLayout>
      <div className='bg-white p-8 rounded-lg dark:bg-nile-blue-900'>
        <h1 className='text-3xl font-bold mb-5'>Manage Users</h1>
        {users.length > 0 && <PaginationControls page={page} pages={pages} setPage={setPage} />}

        {isLoading ? (
          <Loading />
        ) : (
          users
            .filter(({ role }) => role !== 'SUPER_ADMIN')
            .map(user => <UserTab key={user._id} user={user} />)
        )}

        {users.length === 0 && (
          <div className='flex flex-col gap-5 items-center justify-center text-center'>
            <FaUserSlash className='w-[100px] h-[100px]' />
            <span className='text-lg font-medium'>No users to manage.</span>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ManageUsers;
