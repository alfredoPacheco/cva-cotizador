import { Divider, cn } from '@nextui-org/react';

const Title = ({ children, divider = false, className = '' }) => {
  return (
    <div className={cn('flex flex-col justify-center', className)}>
      <h1
        className={`text-4xl sm:text-7xl font-extrabold text-primary font-montHeavy mt-0 md:mt-5`}
      >
        {children}
      </h1>
      {divider && <Divider className="mt:0 sm:mt-5" />}
    </div>
  );
};

export default Title;
