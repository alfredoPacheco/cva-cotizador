import { useState } from 'react';
import { Button } from '@nextui-org/react';
import Logo from '@/images/logo.svg';
import useForm from '@/core/useForm';
import useNotifications from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import ProvidersBlank from '../ProvidersBlank';
import { EmailInput, PasswordInput, TextInput } from '@/ui/Inputs';
import { useSignUpMutation, type SignUpDto } from './useSignup';

const SignupForm = () => {
  const { control, handleSubmit } = useForm<SignUpDto>();
  const [emailSent, setEmailSent] = useState(false);
  const { error } = useNotifications();

  const signupMutation = useSignUpMutation();

  const onSubmit = async (data: SignUpDto) => {
    try {
      // signupMutation.reset(); TODO: Do we need to reset?
      await signupMutation.mutateAsync(data);
      setEmailSent(true);
    } catch (e) {
      handleErrors(e, error);
    }
  };

  if (emailSent)
    return (
      <div className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center">
        <h1 className="text-2xl font-bold">Email Sent!</h1>
        <p className="text-center">
          Please check your email for a verification link.
        </p>
      </div>
    );

  return (
    <form
      className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <img src={Logo.src} alt="Logo" width="250" height="150" />
      <p>Create a new account:</p>
      <TextInput control={control} label="Name" name="name" required focus />
      <EmailInput control={control} required />
      <TextInput control={control} label="Phone" name="phone" />
      <PasswordInput control={control} required />
      <PasswordInput
        control={control}
        required
        label="Confirm Password"
        name="confirmPassword"
      />
      <Button type="submit">Signup</Button>
    </form>
  );
};

const WithProviders = () => {
  return (
    <ProvidersBlank>
      <SignupForm />
    </ProvidersBlank>
  );
};

export default WithProviders;
