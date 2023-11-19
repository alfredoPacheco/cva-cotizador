import { TextInput } from '@/ui/Inputs';
import { useSignupLogic } from './signup.hooks';

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
    <div>
      Signup
      <form onSubmit={onSubmit} className="flex flex-col p-5">
        <TextInput control={form.control} label="Name" name="name" />
        <TextInput control={form.control} label="Email" name="email" />
        <TextInput control={form.control} label="Password" name="password" />
        <TextInput
          control={form.control}
          label="Confirm Password"
          name="confirmPassword"
        />
        <button type="submit">Submit</button>
      </form>
      <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
    </div>
  );
};

export default Signup;
