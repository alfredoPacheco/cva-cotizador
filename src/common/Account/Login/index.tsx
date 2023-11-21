import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useLoginMutation } from './login.hooks';
import { handleErrors } from '@/core/utils';
import { PasswordInput, TextInput } from '@/ui/Inputs';
import type { LoginDto } from './login';
import { Dialog } from '@/ui/Dialog';
import Logo from '@/ui/Logo';
import { Link, PrimaryButton } from '@/ui/Buttons';
import Title from '@/ui/Title';
import { Divider } from '@nextui-org/react';
import Container from '@/ui/Container';
import Paragraph from '@/ui/Paragraph';

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
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      hideCloseButton
      formOff
      actionsOff
    >
      {() => (
        <Container>
          <Logo />
          <Divider />

          <form
            onSubmit={onSubmit}
            className="container max-w-sm flex flex-col items-center mx-auto gap-5 h-full mt-10"
          >
            <Title>Cotizador</Title>
            <Paragraph>Ingresa con tu acceso autorizado</Paragraph>
            <TextInput control={control} name="email" label="Email" />
            <PasswordInput control={control} />
            {error && <p className="text-red-500 text-center mt-5">{error}</p>}

            <PrimaryButton>Entrar</PrimaryButton>
            <Link>¿Olvidaste tu acceso?</Link>
          </form>
        </Container>
      )}
    </Dialog>
  );
};

export default Login;
