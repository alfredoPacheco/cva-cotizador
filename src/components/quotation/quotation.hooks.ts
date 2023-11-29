import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { QuotationDto } from './quotation';
import { useForm } from 'react-hook-form';
import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/core';
import { omit } from 'lodash';

const QUERY_KEY = 'quotations';
const COLLECTION_ID = 'quotations';

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

export const useQuotationList = (enabled = true) => {
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

  const query = useQuery<QuotationDto[]>({
    queryKey: [QUERY_KEY],
    enabled
  });

  useEffect(() => {
    query.refetch();
  }, [debouncedSearch]);

  return { query, filtersForm, debouncedSearch };
};

export const useQuotationSingle = (id: string, enabled = true) => {
  return useQuery<QuotationDto>({
    queryKey: [QUERY_KEY, id],
    enabled
  });
};

export const useQuotationCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      collectionId: COLLECTION_ID,
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    })
  });
};

export const useQuotationUpdate = () => {
  return useMutation({
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const useQuotationDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};
