import { Divider } from '@nextui-org/react';

const Title = ({ children, mt = 0, mb = 0, divider = false }) => {
  return (
    <div className="flex flex-col">
      <h1 className={`text-7xl font-bold text-primary mt-${mt} mb-${mb}`}>
        {children}
      </h1>
      {divider && <Divider />}
    </div>
  );
};

export default Title;
