interface Props {
  children: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({ children }) => {
  return <div className='min-h-full relative'>{children}</div>;
};

export default PageLayout;
