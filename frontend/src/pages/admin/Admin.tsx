import { Link } from 'react-router-dom';

import PageLayout from 'layouts/PageLayout';
import { PATHS } from 'routes/PathConstants';
import { useAppSelector } from 'hooks/useRootStorage';

const Admin = () => {
  const { ADMIN_BOOKS, ADMIN_USERS } = PATHS;
  const { prefersDarkMode } = useAppSelector(state => state.userData);

  return (
    <PageLayout>
      <div
        className={`h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-swan-white rounded-md ${
          prefersDarkMode && 'dark:bg-nile-blue-900'
        }`}>
        <Link
          to={ADMIN_BOOKS}
          className={`bg-nile-blue-900 text-zircon py-2 px-8 w-max h-12 grid place-items-center text-xl rounded-md my-7 border border-transparent font-semibold duration-300 hover:bg-transparent hover:text-nile-blue-900 hover:border-current ${
            prefersDarkMode && 'dark:bg-zircon dark:text-nile-blue-900 hover:dark:text-zircon'
          }`}>
          Manage Books
        </Link>
        <Link
          to={ADMIN_USERS}
          className={`bg-nile-blue-900 text-zircon py-2 px-8 w-max h-12 grid place-items-center text-xl rounded-md my-7 border border-transparent font-semibold duration-300 hover:bg-transparent hover:text-nile-blue-900 hover:border-current ${
            prefersDarkMode && 'dark:bg-zircon dark:text-nile-blue-900 hover:dark:text-zircon'
          }`}>
          Manage Users
        </Link>
      </div>
    </PageLayout>
  );
};

export default Admin;
