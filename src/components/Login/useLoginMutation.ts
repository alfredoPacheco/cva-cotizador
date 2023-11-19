import { AuthCentralService, useAuth } from '@/core';
import { useMutation } from '@tanstack/react-query';

export interface LoginDto {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: (loginDto: LoginDto) => {
      return login(loginDto);
    }
  });
};
