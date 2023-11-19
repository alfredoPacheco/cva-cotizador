import { useForm } from 'react-hook-form';
import { useSignupMutation } from './useSignupMutation';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import { useState } from 'react';
import type { SignupDto } from './signup';
import { account } from '@/core/appwrite';

export const useSignupLogic = ({ validateEmail = false }) => {
  const notifications = useNotifications();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<SignupDto>();

  const signUpMutation = useSignupMutation();

  const onSubmit = form.handleSubmit(async (data: SignupDto) => {
    try {
      await signUpMutation.mutateAsync(data);
      if (validateEmail) {
        await account.createEmailSession(data.email, data.password);
        const verifyUrl = new URL('/verify-email', window.location.origin);
        await account.createVerification(verifyUrl.toString());
        setEmailSent(true);
      }
    } catch (err) {
      console.error(err);
      handleErrors(err, notifications.error);
    }
  });

  const buttonIsDisabled = () => {
    const {
      formState: { isValid, isDirty }
    } = form;

    if (!isDirty) return true;
    if (!isValid) return true;

    const { password, confirmPassword } = form.getValues();
    if (password !== confirmPassword) return true;

    return false;
  };

  return {
    form,
    onSubmit,
    buttonIsDisabled,
    emailSent
  };
};
