import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  percentage: number;
  foregroundTheme?: string;
  backgroundTheme?: string;
}

const Progress: React.FC<Props> = ({ backgroundTheme, foregroundTheme, percentage }) => {
  const { prefersDarkMode } = useAppSelector(state => state.userData);

  return (
    <div
      style={{ background: backgroundTheme }}
      className={`flex h-2.5 rounded-md overflow-clip border-2 flex-1 bg-swan-white ${
        prefersDarkMode && 'dark:border-zircon'
      }`}>
      <div
        className='bg-nile-blue-900'
        style={{ background: foregroundTheme, width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;
