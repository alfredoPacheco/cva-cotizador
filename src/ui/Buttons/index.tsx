import { Button, Link as LinkNextUI } from '@nextui-org/react';
import { PiPlusCircle, PiPlusCircleBold } from 'react-icons/pi';

export const PrimaryButton = props => {
  const { children } = props;
  return (
    <Button
      color="primary"
      className="w-full p-10 text-xl font-bold rounded-xl"
      type="submit"
    >
      {children}
    </Button>
  );
};

export const Link = props => {
  return (
    <LinkNextUI
      className={`text-sm font-semibold ${props.className}`}
      {...props}
    />
  );
};

export const TextButton = props => {
  const { children } = props;
  return (
    <Button
      color="primary"
      variant="light"
      className="p-8 text-xl font-bold rounded-xl"
      type="button"
      startContent={
        <span className="text-4xl">
          <PiPlusCircle />
        </span>
      }
    >
      {children}
    </Button>
  );
};
