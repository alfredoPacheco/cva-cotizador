const Container = ({ children, maxWidth = '5xl', mt = 0, gap = 5, mb = 0 }) => {
  return (
    <div
      className={`container max-w-${maxWidth} mx-auto flex flex-col gap-${gap} h-full mt-${mt} mb-${mb} px-5`}
      // style={{ border: '1px solid red' }}
    >
      {children}
    </div>
  );
};

export default Container;
