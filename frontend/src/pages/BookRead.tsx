import { useParams } from 'react-router-dom';

const BookRead = () => {
  const { id } = useParams();

  return <div>BookRead</div>;
};

export default BookRead;
