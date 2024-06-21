import { useParams } from 'react-router-dom';

import PageLayout from 'layouts/PageLayout';

const BookPreview = () => {
  const { id } = useParams();

  return <PageLayout>BookPreview {id}</PageLayout>;
};

export default BookPreview;
