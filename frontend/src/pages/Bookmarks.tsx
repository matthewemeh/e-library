import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RiBookmarkLine } from 'react-icons/ri';

import PageLayout from 'layouts/PageLayout';
import { PATHS } from 'routes/PathConstants';
import BooksPanel from 'components/BooksPanel';
import { useAppSelector } from 'hooks/useRootStorage';

const Bookmarks = () => {
  const { HOME } = PATHS;
  const { bookmarkedBookIDs } = useAppSelector(state => state.userData);
  const emptyBookmarksComponent = useMemo<JSX.Element>(() => {
    return (
      <div className='flex flex-col gap-5 items-center justify-center text-center'>
        <RiBookmarkLine className='w-[80px] h-[80px]' />
        <span className='text-lg font-medium'>
          No Bookmarks here. Visit the{' '}
          <Link className='underline' to={HOME}>
            Home page
          </Link>{' '}
          to start reading
        </span>
      </div>
    );
  }, []);

  return (
    <PageLayout>
      <BooksPanel
        emptyBookComponent={emptyBookmarksComponent}
        filterPredicate={({ _id }) => bookmarkedBookIDs.includes(_id)}
      />
    </PageLayout>
  );
};

export default Bookmarks;
