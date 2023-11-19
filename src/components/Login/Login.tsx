import { Modal, ModalContent, ModalBody, Button } from '@nextui-org/react';
import Logo from '@/images/logo.svg';
import { useForm } from '@/core';
import { handleErrors } from '@/core/utils';
import { EmailInput, PasswordInput } from '@/ui/Inputs';
import { useLoginMutation } from './useLoginMutation';
import { useNotifications } from '@/core/useNotifications';

const Login = ({ isOpen, onOpenChange }) => {
  const { control, handleSubmit, setVal } = useForm<any>({
    load: {
      email: 'j.alfredo.pacheco@gmail.com',
      password: 'Alfa0210'
    }
  });

  const loginMutation = useLoginMutation();
  const { error } = useNotifications();

  const onSubmit = async data => {
    try {
      await loginMutation.mutateAsync(data);
      setVal('password', '');
      // reset();
    } catch (e) {
      handleErrors(e, error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="full"
      hideCloseButton
    >
      <ModalContent>
        {() => (
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="container max-w-sm flex flex-col items-center mx-auto gap-5 h-full justify-center"
            >
              <img src={Logo.src} alt="Logo" width="250" height="150" />
              <EmailInput className="mt-8" required control={control} />
              <PasswordInput required control={control} type="password" />
              {/* {error && (
                <p className="text-red-500 text-center mt-5">{error}</p>
              )} */}

              <Button color="primary" className="w-1/2 mt-5" type="submit">
                Login
              </Button>
            </form>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Login;
