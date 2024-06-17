import { useParams } from 'react-router-dom';

const Book = () => {
  const { id } = useParams();

  return <div>Book</div>;
};

export default Book;
