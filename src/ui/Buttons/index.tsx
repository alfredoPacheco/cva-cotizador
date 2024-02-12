import {
  Button,
  Link as LinkNextUI,
  type HTMLNextUIProps
} from '@nextui-org/react';
import { PiPlusCircle, PiPlusCircleBold } from 'react-icons/pi';

interface ButtonProps extends HTMLNextUIProps<'button'> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onPress?: (e: any) => void;
}

export const PrimaryButton = props => {
  const { children } = props;
  return (
    <Button
      color="primary"
      className="w-full p-10 text-2xl font-bold rounded-xl font-montHeavy"
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

interface TextButtonProps extends ButtonProps {}
export const TextButton: React.FC<TextButtonProps> = props => {
  const { children } = props;
  return (
    <Button
      {...props}
      color="primary"
      variant="light"
      className="py-4 px-1 text-xl font-bold rounded-xl text-left"
      type="button"
      disableRipple
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

interface FormButtonProps extends ButtonProps {
  loading?: boolean;
}
export const FormButton: React.FC<FormButtonProps> = props => {
  return (
    <Button
      {...props}
      color="primary"
      variant="light"
      className={
        'py-4 px-0 sm:px-2 font-bold rounded-xl text-left text-xs sm:text-sm ' +
        props.className
      }
      size="sm"
      isLoading={props.loading}
    />
  );
};
