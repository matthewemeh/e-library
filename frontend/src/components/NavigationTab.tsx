import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { PATHS } from 'routes/PathConstants';
import { addClass, removeClass } from '../utils';

type ActiveNavigation = (typeof PATHS)[keyof typeof PATHS];

interface Props {
  text: string;
  icon: JSX.Element;
  to: ActiveNavigation;
}

const NavigationTab: React.FC<Props> = ({ to, icon, text }) => {
  const NAV_LINK = 'nav-link';
  const { pathname } = useLocation();
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (pathname === to) addClass(linkRef.current, 'bg-zircon', 'dark:text-nile-blue-900');
    else removeClass(linkRef.current, 'bg-zircon', 'dark:text-nile-blue-900');
  }, [pathname, linkRef]);

  return (
    <Link
      to={to}
      ref={linkRef}
      className={`${NAV_LINK} flex text-[17px] font-medium items-center px-3 py-2.5 gap-4 border border-transparent rounded-md transition-colors ease-in-out duration-300 hover:border-current`}>
      {icon}
      {text}
    </Link>
  );
};

export default NavigationTab;
