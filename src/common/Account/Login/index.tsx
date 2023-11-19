import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useLoginMutation } from './login.hooks';
import { handleErrors } from '@/core/utils';
import { EmailInput, PasswordInput } from '@/ui/Inputs';
import type { LoginDto } from './login';
import { Dialog } from '@/ui/Dialog';
import Logo from '@/ui/Logo';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful }
  } = useForm<LoginDto>({
    defaultValues: {
      email: 'apacheco@inspiracode.net',
      password: 'Alfa0210'
    }
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful]);

  const loginMutation = useLoginMutation();

  const [error, setError] = useState<string>();

  const onSubmit = handleSubmit(async data => {
    console.log('onSubmit', data);
    try {
      setError(undefined);
      await loginMutation.mutateAsync(data);
    } catch (e) {
      handleErrors(e, msg => {
        setError(msg);
      });
    }
  });

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose} hideCloseButton formOff>
      {() => (
        <form
          onSubmit={onSubmit}
          className="container max-w-sm flex flex-col items-center mx-auto gap-5 h-full justify-center"
        >
          <Logo width="250" height="150" />
          <EmailInput control={control} />
          <PasswordInput control={control} />
          {error && <p className="text-red-500 text-center mt-5">{error}</p>}

          <button color="primary" className="w-1/2 mt-5" type="submit">
            Login
          </button>
        </form>
      )}
    </Dialog>
  );
};

export default Login;
