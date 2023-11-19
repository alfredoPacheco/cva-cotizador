import { useMutation } from '@tanstack/react-query';
import type { SignupDto } from './signup';
import { ID, account } from '@/core/appwrite';

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
