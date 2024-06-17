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
    if (pathname === to) addClass(linkRef.current, 'bg-zircon');
    else removeClass(linkRef.current, 'bg-zircon');
  }, [pathname, linkRef]);

  return (
    <Link
      to={to}
      ref={linkRef}
      className={`${NAV_LINK} flex text-[17px] font-medium items-center px-3 py-2.5 gap-4 border border-transparent rounded-md transition-colors duration-300 hover:border-nile-blue-900`}>
      {icon}
      {text}
    </Link>
  );
};

export default NavigationTab;
