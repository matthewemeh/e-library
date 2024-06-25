import { useState } from 'react';
import CaretDownImage from 'assets/caret-down-fill.svg';

interface Props {
  list: string[];
  tabIndex?: number;
  chevronImage?: string;
  selectedValue: string;
  onSelectItem?: () => void;
  extraDropdownListClassNames?: string;
  extraDropdownButtonClassNames?: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const Dropdown: React.FC<Props> = ({
  list,
  tabIndex,
  chevronImage,
  onSelectItem,
  selectedValue,
  setSelectedItem,
  extraDropdownListClassNames,
  extraDropdownButtonClassNames
}) => {
  const [dropdownActive, setDropdownActive] = useState(false);

  return (
    <button
      type='button'
      id='dropdown-button'
      tabIndex={tabIndex}
      aria-haspopup={true}
      aria-controls='dropdown-list'
      aria-expanded={dropdownActive}
      onBlur={() => setDropdownActive(false)}
      onClick={() => setDropdownActive(true)}
      className={`relative cursor-pointer w-[104px] border border-silver-chalice rounded-full flex items-center justify-center gap-0.5 text-[14px] font-normal -tracking-[0.165px] text-mirage focus:border-nile-blue-900 ${extraDropdownButtonClassNames}`}>
      <p className='cursor-[inherit]'>{selectedValue}</p>
      <img
        alt='chevron-image'
        className='w-5 cursor-[inherit]'
        src={chevronImage ?? CaretDownImage}
      />

      <ul
        role='menu'
        id='dropdown-list'
        aria-labelledby='dropdown-button'
        className={`absolute z-[1] top-[calc(100%+5px)] w-full h-[25vh] rounded-lg bg-white shadow-md border border-[rgba(0,0,0,0.1)] flex flex-col overflow-y-scroll duration-300 ${extraDropdownListClassNames} ${
          dropdownActive || 'opacity-0 invisible'
        }`}>
        {list.map((item, index) => (
          <li
            key={index}
            role='menuitem'
            className={`cursor-pointer ${item === selectedValue && 'bg-nile-blue-900 text-white'}`}
            onClick={e => {
              setSelectedItem(item);
              setDropdownActive(false);
              onSelectItem?.();
              e.stopPropagation();
            }}>
            {item}
          </li>
        ))}
      </ul>
    </button>
  );
};

export default Dropdown;
