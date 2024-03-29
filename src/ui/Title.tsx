import { Divider, cn } from '@nextui-org/react';

const Title = ({
  children,
  divider = false,
  className = '',
  h1ClassName = ''
}) => {
  return (
    <div className={cn('flex flex-col justify-center', className)}>
      <h1
        className={cn(
          `text-4xl sm:text-7xl font-extrabold text-primary font-montHeavy mt-0 md:mt-5`,
          h1ClassName
        )}
      >
        {children}
      </h1>
      {divider && <Divider className="mt:0 sm:mt-5" />}
    </div>
  );
};

export default Title;
