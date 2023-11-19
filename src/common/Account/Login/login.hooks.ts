import { useMutation } from '@tanstack/react-query';
import { AuthCentralService } from '@/core/AuthCentralService';
import type { LoginDto } from './login';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginDto) => {
      console.log('mutationFn', data);
      return AuthCentralService.login(data);
    }
  });
};
