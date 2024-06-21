interface Props {
  children: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({ children }) => {
  return <div className='bg-white rounded-md p-8 dark:dark:bg-nile-blue-900'>{children}</div>;
};

export default PageLayout;
