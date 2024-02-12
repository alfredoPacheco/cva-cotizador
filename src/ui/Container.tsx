const Container = ({ children, maxWidth = '4xl', mt = 0, gap = 5, mb = 0 }) => {
  return (
    <div
      className={`container px-1 max-w-${maxWidth} mx-auto flex flex-col gap-${gap} h-full mt-${mt} mb-${mb} sm:px-5`}
      // style={{ border: '1px solid red' }}
    >
      {children}
    </div>
  );
};

export default Container;
