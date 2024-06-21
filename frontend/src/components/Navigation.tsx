import { Link } from 'react-router-dom';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import {
  RiHome4Line,
  RiUser3Line,
  RiBookmarkLine,
  RiBookOpenLine,
  RiSettings3Line
} from 'react-icons/ri';
import { MdOutlineAdminPanelSettings, MdLocalLibrary } from 'react-icons/md';

import useAuth from 'hooks/useAuth';
import NavigationTab from './NavigationTab';
import { PATHS } from 'routes/PathConstants';

const Navigation = () => {
  const isAuthorized: boolean = useAuth();
  const { HOME, BOOKMARKS, PROFILE, HELP, BOOKS, SETTINGS, ADMIN } = PATHS;

  return (
    <nav className='row-start-1 row-end-3 p-3 bg-white dark:text-zircon dark:bg-nile-blue-900'>
      <Link to={HOME} className='font-bold text-xl flex items-center gap-2'>
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
        <li>
          <NavigationTab
            to={SETTINGS}
            text='Settings'
            icon={<RiSettings3Line className='text-current text-[21px]' />}
          />
        </li>
        <li>
          <NavigationTab
            to={HELP}
            text='Help'
            icon={<IoMdHelpCircleOutline className='text-current text-[21px]' />}
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
