import {
  Button,
  Link as LinkNextUI,
  type HTMLNextUIProps
} from '@nextui-org/react';
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

interface TextButtonProps extends HTMLNextUIProps<'button'> {}
export const TextButton: React.FC<TextButtonProps> = props => {
  const { children } = props;
  return (
    <Button
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

interface FormButtonProps extends HTMLNextUIProps<'button'> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onPress?: (e: any) => void;
}
export const FormButton: React.FC<FormButtonProps> = props => {
  return (
    <Button
      color="primary"
      variant="light"
      className="py-4 px-2 font-bold rounded-xl text-left"
      type="button"
      size="md"
      {...props}
    />
  );
};
