import { Link } from 'react-router-dom';
import { MdOutlineAdminPanelSettings, MdLocalLibrary } from 'react-icons/md';
import { RiHome4Line, RiUser3Line, RiBookmarkLine, RiBookOpenLine } from 'react-icons/ri';

import useAuth from 'hooks/useAuth';
import NavigationTab from './NavigationTab';
import { PATHS } from 'routes/PathConstants';

const Navigation = () => {
  const isAuthorized: boolean = useAuth();
  const { HOME, BOOKMARKS, PROFILE, BOOKS, ADMIN } = PATHS;

  return (
    <nav className='row-start-1 row-end-3 p-3 bg-white dark:text-zircon dark:bg-nile-blue-900'>
      <Link to={HOME} className='font-bold text-xl flex items-center gap-2 w-fit'>
        <MdLocalLibrary className='w-7 h-7 text-current' />
        E-Library
      </Link>
      <ul className='mt-5 text-nile-blue-800 flex flex-col gap-2 dark:text-zircon'>
        <li>
          <NavigationTab text='Home' to={HOME} icon={<RiHome4Line className='text-current' />} />
        </li>
        <li>
          <NavigationTab
            to={BOOKS}
            text='Books'
            icon={<RiBookOpenLine className='text-current' />}
          />
        </li>
        <li>
          <NavigationTab
            to={BOOKMARKS}
            text='Bookmarks'
            icon={<RiBookmarkLine className='text-current' />}
          />
        </li>
        <li>
          <NavigationTab
            to={PROFILE}
            text='Profile'
            icon={<RiUser3Line className='text-current text-[21px]' />}
          />
        </li>
        {isAuthorized && (
          <li>
            <NavigationTab
              to={ADMIN}
              text='Admin'
              icon={<MdOutlineAdminPanelSettings className='text-current text-[21px]' />}
            />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
