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
import { useEffect, useState } from 'react';
import { useDebounce } from '@/core';
import { omit } from 'lodash';

const QUERY_KEY = 'customers';
const COLLECTION_ID = 'customers';

type listResponse = {
  documents: CustomerDto[];
  total: number;
};

function getSearchQuery(searchValue: string, sample: any) {
  const result: string[] = [];
  if (!searchValue || searchValue.trim() === '') return result;

  // const sample: T = {} as T;
  const entity = omit(sample, [
    '$id',
    '$collectionId',
    '$createdAt',
    '$databaseId',
    '$permissions',
    '$updatedAt'
  ]);
  // console.log('sample', sample);
  // console.log('entity', entity);
  Object.keys(entity).forEach(prop => {
    if (typeof sample[prop] === 'string') {
      result.push(Query.search(prop, searchValue));
    }
  });
  return result;
}

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
    queryKey: [QUERY_KEY],
    enabled
  });

  useEffect(() => {
    query.refetch();
  }, [debouncedSearch]);

  return { query, filtersForm, debouncedSearch };
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
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const useCustomerDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};
