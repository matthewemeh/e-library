interface Props {
  extraClassNames?: string;
  spinnerClassNames?: string;
}

const Loading: React.FC<Props> = ({ extraClassNames, spinnerClassNames }) => {
  return (
    <div className={`w-full h-full grid place-items-center ${extraClassNames}`}>
      <div
        className={`w-20 h-20 bg-center bg-no-repeat bg-[url(./assets/loading-spin.svg)] ${spinnerClassNames}`}
      />
    </div>
  );
};

export default Loading;
