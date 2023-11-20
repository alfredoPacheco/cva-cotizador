import { useQuery } from '@tanstack/react-query';
import { type CustomerDto } from './customer';
import type { QueryKey } from '@/core/ReactQueryProvider/queryKeys';

export const useCustomerList = () => {
  return useQuery<CustomerDto[]>({
    queryKey: ['customers', { type: 'list' } as QueryKey]
  });
};

export const useCustomerSingle = id => {
  return useQuery<CustomerDto[]>({
    queryKey: ['customers', { type: 'single', id } as QueryKey]
  });
};
