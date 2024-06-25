import { useParams } from 'react-router-dom';

const BookRead = () => {
  const { id } = useParams();

  return <div>BookRead {id}</div>;
};

export default BookRead;
