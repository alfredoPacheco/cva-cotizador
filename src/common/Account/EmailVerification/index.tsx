import { useEmailVerification } from '@/common/Account/EmailVerification/useEmailVerification';
import Logo from '@/ui/Logo';

const VerifyEmail = () => {
  const { error, verified } = useEmailVerification();
  if (error)
    return (
      <div className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center">
        <Logo width="150" height="150" />
        <h1 className="text-2xl font-bold">Email Verification Failed!</h1>
        <p className="text-center">Invalid Link or Token expired </p>
        <p className="text-center">
          <a href="/">Go to Home</a>
        </p>
      </div>
    );

  if (verified)
    return (
      <div className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center">
        <Logo width="150" height="150" />
        <h1 className="text-2xl font-bold">Email Verified Successfully!</h1>
        <p className="text-center">
          You will be redirected to the login page in 5 seconds.
        </p>
      </div>
    );

  return (
    <div className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center">
      <Logo width="150" height="150" />
      <p>Verifying Email...</p>
    </div>
  );
};

export default VerifyEmail;
