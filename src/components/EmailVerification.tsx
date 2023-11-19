import { useEffect, useState } from 'react';
import { account } from '@/core/appwriteClient';
import Logo from '@/images/logo.svg';

const EmailVerification = () => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    account
      .updateVerification(userId, secret)
      .then(() => {
        setVerified(true);
      })
      .catch(error => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (verified) {
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
    }
  }, [verified]);

  if (error)
    return (
      <div className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center">
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
        <h1 className="text-2xl font-bold">Email Verified Successfully!</h1>
        <p className="text-center">
          You will be redirected to the login page in 5 seconds.
        </p>
      </div>
    );

  return (
    <div className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center">
      <img src={Logo.src} alt="Logo" width="250" height="150" />
      <p>Verifying Email...</p>
    </div>
  );
};

export default EmailVerification;
