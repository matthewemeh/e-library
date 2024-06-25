import Loading from '../Loading';

interface Props {
  href: string;
  title: string;
  hidden?: boolean;
  tabIndex?: number;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  extraClassNames?: string;
  extraStyles?: React.CSSProperties;
  target?: React.HTMLAttributeAnchorTarget;
}

const AuthButtonLink: React.FC<Props> = ({
  href,
  title,
  hidden,
  target,
  onClick,
  tabIndex,
  isLoading,
  loadingText,
  extraStyles,
  extraClassNames
}) => {
  return (
    <a
      href={href}
      target={target}
      hidden={hidden}
      onClick={onClick}
      style={extraStyles}
      tabIndex={tabIndex}
      className={`cursor-pointer w-full flex items-center justify-center gap-2 mt-10 font-inter rounded-lg bg-nile-blue-900 text-base font-semibold text-white py-2.5 px-[18px] h-11 border border-nile-blue-900 transition-colors duration-300 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none hover:text-black focus:text-black hover:bg-white focus:bg-white phones:font-bold disabled:bg-[hsl(0,0%,80%)] disabled:text-[hsl(218,11%,45%)] disabled:border-transparent disabled:hover:shadow-none disabled:focus:shadow-none disabled:cursor-default ${
        isLoading && '!bg-nile-blue-900'
      } ${extraClassNames}`}>
      {isLoading ? (
        <div className='flex gap-x-2'>
          <span>{loadingText}</span>
          <Loading extraClassNames='text-[10.5px]' />
        </div>
      ) : (
        title
      )}
    </a>
  );
};

export default AuthButtonLink;
