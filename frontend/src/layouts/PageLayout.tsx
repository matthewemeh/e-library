interface Props {
  children: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({ children }) => {
  return <div className='p-3 rounded-md'>{children}</div>;
};

export default PageLayout;
