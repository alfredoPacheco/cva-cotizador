import { useForm } from 'react-hook-form';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import { useState } from 'react';
import type { SignupDto } from './signup';
import { ID, account } from '@/core/appwriteClient';
import { useMutation } from '@tanstack/react-query';

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
      } else {
        notifications.success('Account created successfully');
        window.location.href = '/';
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

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (data: SignupDto) => {
      const { email, password, confirmPassword, name } = data;
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      try {
        const session = await account.getSession('current');
        if (session) {
          await account.deleteSession('current');
        }
      } catch {}

      return await account.create(ID.unique(), email, password, name);
    }
  });
};
