import { useMutation } from '@tanstack/react-query';
import type { EmailDto } from './email';
import { functions } from '@/core/appwriteClient';

export const useSendEmail = () => {
  return useMutation({
    mutationFn: async (email: EmailDto) => {
      const payload = JSON.stringify(email);
      const response = await functions.createExecution(
        'emails',
        payload,
        false
      );
      const parsedResponse = JSON.parse(response.responseBody);
      // console.log('email response', parsedResponse);
      if (!parsedResponse.ok) throw new Error(parsedResponse.response);
      return parsedResponse;
    }
  });
};
