import { Link } from 'react-router-dom';

import PageLayout from 'layouts/PageLayout';
import { PATHS } from 'routes/PathConstants';

const Admin = () => {
  const { ADMIN_BOOKS, ADMIN_USERS } = PATHS;

  return (
    <PageLayout>
      <div className='h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-nile-blue-900 rounded-md'>
        <Link
          to={ADMIN_BOOKS}
          className='bg-nile-blue-900 text-zircon py-2 px-8 w-max h-12 grid place-items-center text-xl rounded-md my-7 border border-transparent font-semibold duration-300 dark:bg-zircon dark:text-nile-blue-900 hover:bg-transparent hover:text-nile-blue-900 hover:dark:text-zircon hover:border-current'>
          Manage Books
        </Link>
        <Link
          to={ADMIN_USERS}
          className='bg-nile-blue-900 text-zircon py-2 px-8 w-max h-12 grid place-items-center text-xl rounded-md my-7 border border-transparent font-semibold duration-300 dark:bg-zircon dark:text-nile-blue-900 hover:bg-transparent hover:text-nile-blue-900 hover:dark:text-zircon hover:border-current'>
          Manage Users
        </Link>
      </div>
    </PageLayout>
  );
};

export default Admin;
