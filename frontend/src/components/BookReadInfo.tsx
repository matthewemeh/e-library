import { useNavigate } from 'react-router-dom';

interface Props {
  bookReadInfo: BookReadInfo;
}

const BookReadInfo: React.FC<Props> = ({ bookReadInfo }) => {
  const navigate = useNavigate();
  const { bookID, percentRead } = bookReadInfo;

  return (
    <div
      onClick={() => navigate({ pathname: `/books/${bookID}/read` })}
      className='grid grid-cols-[25%_1fr_20%] gap-4 items-center justify-between px-1 py-1.5 bg-white text-nile-blue-900 dark:bg-nile-blue-900 dark:text-zircon'>
      <div className='flex items-center gap-1'>
        <img src='' alt='' />
        <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{}</p>
      </div>
      <div></div>
      <div>{percentRead}% complete</div>
    </div>
  );
};

export default BookReadInfo;
