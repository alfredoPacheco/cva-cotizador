import { Divider } from '@nextui-org/react';

const Title = ({ children, mt = 0, mb = 0, divider = false }) => {
  return (
    <div className="flex flex-col justify-center">
      <h1
        className={`text-7xl font-extrabold text-primary font-montHeavy`}
        style={{ marginBottom: mb, marginTop: mt }}
      >
        {children}
      </h1>
      {divider && <Divider />}
    </div>
  );
};

export default Title;
