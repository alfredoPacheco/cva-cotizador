import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { CustomerDto } from './customer';
import { useForm } from 'react-hook-form';
import { Query } from 'appwrite';
import { useEffect } from 'react';
import { useDebounce } from '@/core';
import { omit } from 'lodash';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';

const QUERY_KEY = 'customers';
const COLLECTION_ID = 'customers';

export const useCustomerList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 100);
  // const [searchQuery, setSearchQuery] = useState<Query[]>([]);

  // useEffect(() => {
  //   const newSearch = getSearchQuery(debouncedSearch, {
  //     name: ''
  //     // email: '',
  //     // phone: '',
  //     // address: '',
  //     // businessName: '',
  //     // taxRegime: ''
  //   });
  //   console.log('newSearch', newSearch);
  //   // setSearchQuery(newSearch);
  // }, [debouncedSearch]);

  const query = useQuery<CustomerDto[]>({
    queryKey: [
      QUERY_KEY,
      { limit: 5000, queries: [Query.orderDesc('$createdAt')] } as ListQueryType
    ],
    enabled
  });

  useEffect(() => {
    query.refetch();
  }, [debouncedSearch]);

  return { query, filtersForm, debouncedSearch };
};

export const useCustomerSingle = (id: string, enabled = true) => {
  return useQuery<CustomerDto>({
    queryKey: [QUERY_KEY, id],
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
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const useCustomerDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};
