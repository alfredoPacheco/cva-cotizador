import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type QueryType } from '@/core/ReactQueryProvider/queryKeys';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { CustomerDto } from './customer';
import { useForm } from 'react-hook-form';
import { Query } from 'appwrite';

const QUERY_KEY = 'customers';
const COLLECTION_ID = 'customers';

type listResponse = {
  documents: CustomerDto[];
  total: number;
};

export const useCustomerList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const query = useQuery<listResponse>({
    queryKey: [
      QUERY_KEY,
      { type: 'list', queries: [Query.orderDesc('$id')] } as QueryType
    ],
    enabled
  });

  return { query, filtersForm };
};

export const useCustomerSingle = (id: string, enabled = true) => {
  return useQuery<CustomerDto>({
    queryKey: [QUERY_KEY, { type: 'single', id } as QueryType],
    enabled
  });
};

export const useCustomerCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      collectionId: COLLECTION_ID,
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    })
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
