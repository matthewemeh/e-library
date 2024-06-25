import PageLayout from 'layouts/PageLayout';
import ReadBooks from 'components/ReadBooks';
import BooksPanel from 'components/BooksPanel';

const Home = () => {
  return (
    <PageLayout>
      <ReadBooks />
      <BooksPanel paginated showFilters />
    </PageLayout>
  );
};

export default Home;
