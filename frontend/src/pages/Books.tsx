import BooksPanel from 'components/BooksPanel';
import PageLayout from 'layouts/PageLayout';

const Books = () => {
  return (
    <PageLayout>
      <BooksPanel showFilters paginated />
    </PageLayout>
  );
};

export default Books;
