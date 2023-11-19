import AppShell from '@/common/AppShell';
import { TextInput } from '@/ui/Inputs';
import { useSignupLogic } from './signup.hooks';
import { Button } from '@nextui-org/react';
import Logo from '@/ui/Logo';

const Signup = () => {
  const { form, onSubmit, emailSent } = useSignupLogic({
    validateEmail: false
  });

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
      onSubmit={onSubmit}
      className="container max-w-sm mx-auto flex flex-1 flex-col items-center gap-5 h-full justify-center"
      autoComplete="off"
    >
      <Logo />
      <h1 className="text-2xl">Create a new account:</h1>
      <TextInput control={form.control} label="Name" name="name" />
      <TextInput control={form.control} label="Email" name="email" />
      <TextInput control={form.control} label="Password" name="password" />
      <TextInput
        control={form.control}
        label="Confirm Password"
        name="confirmPassword"
      />
      <Button type="submit">Signup</Button>
      <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
    </form>
  );
};

const WithAppShell = () => {
  return (
    <AppShell noAuth blank>
      <Signup />
    </AppShell>
  );
};

export default WithAppShell;
