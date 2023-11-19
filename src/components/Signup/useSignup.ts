import { ID, account } from '@/core/appwriteClient';
import { useMutation } from '@tanstack/react-query';

export interface SignUpDto {
  name: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (data: SignUpDto) => {
      try {
        const session = await account.getSession('current');
        if (session) {
          await account.deleteSession('current');
        }
      } catch {
        // No session yet
      }
      const { email, password, confirmPassword, name } = data;
      if (password !== confirmPassword) {
        throw new Error('Password does not match');
      }
      await account.create(ID.unique(), email, password, name);
      await account.createEmailSession(email, password);
      const verifyUrl = new URL('/verify', window.location.origin);
      await account.createVerification(verifyUrl.toString());
    }
  });
};
