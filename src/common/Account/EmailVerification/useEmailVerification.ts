import { account } from '@/core/appwrite';
import { useEffect, useState } from 'react';

export const useEmailVerification = () => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    if (userId === null || secret === null) {
      setError(true);
      return;
    }

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

  return { verified, error };
};
