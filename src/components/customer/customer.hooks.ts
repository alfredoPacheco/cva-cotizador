import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type QueryType } from '@/core/ReactQueryProvider/queryKeys';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { CustomerDto } from './customer';
import { useForm } from 'react-hook-form';

const QUERY_KEY = 'customers';
const COLLECTION_ID = 'customers';

export const useCustomerList = () => {
  const form = useForm();

  console.log('useCustomerList');
  const query = useQuery<CustomerDto[]>({
    queryKey: [QUERY_KEY, { type: 'list' } as QueryType]
  });

  return { query, form };
};

export const useCustomerSingle = (id: string) => {
  return useQuery<CustomerDto>({
    queryKey: [QUERY_KEY, { type: 'single', id } as QueryType]
  });
};

export const useCustomerCreate = () => {
  return useMutation({
    ...defaultCreateMutation([QUERY_KEY], COLLECTION_ID, useQueryClient())
  });
};

export const useCustomerUpdate = () => {
  return useMutation({
    ...defaultUpdateMutation([QUERY_KEY], COLLECTION_ID, useQueryClient())
  });
};

export const useCustomerDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], COLLECTION_ID, useQueryClient())
  });
};
