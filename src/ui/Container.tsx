const Container = ({ children, maxWidth = '5xl', mt = 0 }) => {
  return (
    <div
      className={`container max-w-${maxWidth} mx-auto flex flex-col gap-5 h-full mt-${mt}`}
      // style={{ border: '1px solid red' }}
    >
      {children}
    </div>
  );
};

export default Container;
