import { useRef } from 'react';
import { addClass, removeClass } from 'utils';
import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  name: string;
  onClick?: () => void;
}

const SortButton: React.FC<Props> = ({ name, onClick }) => {
  const SORT_BUTTON_CLASS = 'sort-button';
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { prefersDarkMode } = useAppSelector(state => state.userData);

  const updateSortButton = () => {
    const sortButtons = document.querySelectorAll<HTMLButtonElement>(`.${SORT_BUTTON_CLASS}`);
    sortButtons.forEach(sortButton => {
      addClass(
        sortButton,
        'bg-zircon',
        'text-slate-800',
        `${prefersDarkMode && 'dark:border-transparent'}`
      );
      removeClass(
        sortButton,
        'bg-nile-blue-950',
        'text-swan-white',
        `${prefersDarkMode && 'dark:border-swan-white'}`
      );
    });
    removeClass(
      buttonRef.current,
      'bg-zircon',
      'text-slate-800',
      `${prefersDarkMode && 'dark:border-transparent'}`
    );
    addClass(
      buttonRef.current,
      'bg-nile-blue-950',
      'text-swan-white',
      `${prefersDarkMode && 'dark:border-swan-white'}`
    );

    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      onClick={updateSortButton}
      className={`${SORT_BUTTON_CLASS} border-2 text-[17px] bg-zircon text-slate-800 rounded-3xl py-2 px-6 font-bold ease-in-out duration-300 ${
        prefersDarkMode && 'dark:border-transparent'
      }`}>
      {name}
    </button>
  );
};

export default SortButton;
